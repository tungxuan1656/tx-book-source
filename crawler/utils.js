import cheerio from 'cheerio'
import fs from 'fs'
import puppeteer from 'puppeteer'
import { COOKIES, REQUEST_CONFIG } from './auth.js'

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const crawl_content_1tab = async (browser, link) => {
  const page = await browser.newPage()
  for (let i = 0; i < COOKIES.length; i++) await page.setCookie(COOKIES[i])
  await page.setExtraHTTPHeaders({ ...REQUEST_CONFIG.headers })
  await page.goto(link)

  const data1 = await page.evaluate(() => document.querySelector('*').outerHTML)
  page.close()

  let $ = cheerio.load(data1)
  const content = $('#chapter-content').html()
  const title = $('main[data-x-bind=ChapterAuto] div div h2.text-center').html()
  const output = content.split('<br>').filter((t) => t.trim() !== '')
  if (output.length < 2) {
    console.log('>=== Content too short, retrying...', content.slice(0, 100))
    return crawl_content_1tab(browser, link)
  }

  return [output, title]
}

const crawl_puppeteer = async (browser, output, link, name) => {
  try {
    const [[arr1, title], [arr2], [arr3], [arr4], [arr5]] = await Promise.all([
      crawl_content_1tab(browser, link),
      crawl_content_1tab(browser, link),
      crawl_content_1tab(browser, link),
      crawl_content_1tab(browser, link),
      crawl_content_1tab(browser, link),
    ])

    const length = Math.max(arr1.length, arr2.length, arr3.length, arr4.length, arr5.length)
    const newArr = []
    for (let i = 0; i < length; i++) {
      const text = [arr1[i], arr2[i], arr3[i], arr4[i], arr5[i]].find(
        (t) => t && t.length > 0 && !t.startsWith('<canvas'),
      )
      if (!text) console.log(arr1[i], arr2[i], arr3[i], arr4[i], arr5[i])
      newArr.push(text ?? arr1[i])
    }
    const chapterContent = newArr.join('<br><br>').replace(/<div[^>]*><\/div>/gi, '')
    const chapterFull = `<div><h2>${title}</h2><div>${chapterContent}</div></div>`

    if (chapterContent.includes('<canvas')) return crawl_puppeteer(browser, output, link, name)

    fs.writeFileSync(output + '/chapters' + `/${name}.html`, chapterFull)
    return title ?? 'Chương lỗi nội dung'
  } catch (error) {
    console.log('Error crawling link:', link, error.message)
    fs.writeFileSync(output + '/chapters' + `/${name}.html`, '`<div><h2>Chương lỗi nội dung</h2></div>`')
    return 'Chương lỗi nội dung'
  }
}

const create_book_folder = () => {
  try {
    if (!fs.existsSync(global.OUTPUT_FOLDER)) {
      fs.mkdirSync(global.OUTPUT_FOLDER)
    }
    if (!fs.existsSync(global.OUTPUT_FOLDER + '/chapters')) {
      fs.mkdirSync(global.OUTPUT_FOLDER + '/chapters')
    }
  } catch (err) {
    console.error(err)
  }
}

const crawl = async () => {
  create_book_folder()
  const chapter_length = global.BOOK_INFO.end
  const references = []
  const t1 = new Date().getTime()
  const browser = await puppeteer.launch({ devtools: false, args: ['--disable-web-security'] })
  for (let index = global.BOOK_INFO.start; index <= chapter_length; index++) {
    console.log(`(${index}/${chapter_length})`, `${global.BASE_URL}${index}`)
    const chapter_name = await crawl_puppeteer(browser, global.OUTPUT_FOLDER, `${global.BASE_URL}${index}`, `chapter-${index}`)

    if (chapter_name === '') {
      console.log('ERROR!!!')
      return
    }

    references.push(chapter_name.trim())
    console.log('=====>', chapter_name.trim())
    await sleep(100)
  }
  await browser.close()
  const t2 = new Date().getTime()
  console.log(`Crawl completed in ${(t2 - t1) / 1000} seconds`)

  const book = {
    name: global.BOOK_INFO.name,
    count: global.BOOK_INFO.count,
    author: global.BOOK_INFO.author,
    references,
    id: global.BOOK_INFO.id,
  }

  fs.writeFileSync(global.OUTPUT_FOLDER + '/book.json', JSON.stringify(book))
}

export { crawl, crawl_puppeteer, sleep }
