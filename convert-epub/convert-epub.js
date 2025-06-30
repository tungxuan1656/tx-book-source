import fs from 'fs'
import path from 'path'
import { JSDOM } from 'jsdom'

/**
 * Xử lý thư mục sách EPUB đã được giải nén
 * @param {string} epubDir - Đường dẫn tới thư mục EPUB đã giải nén
 * @param {string} outputDir - Đường dẫn tới thư mục output
 * @param {string} bookId - ID của sách (được truyền từ process)
 * @param {string} bookName - Tên sách
 * @param {string} author - Tác giả (tùy chọn)
 */
function processEpubDirectory(epubDir, outputDir, bookId, bookName, author = '') {
  try {
    // Tạo thư mục output nếu chưa tồn tại
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
      console.log(`Đã tạo thư mục output: ${outputDir}`)
    }

    // Tạo thư mục chapters trong output
    const chaptersDir = path.join(outputDir, 'chapters')
    if (!fs.existsSync(chaptersDir)) {
      fs.mkdirSync(chaptersDir, { recursive: true })
      console.log(`Đã tạo thư mục chapters: ${chaptersDir}`)
    }

    // Đường dẫn tới file nav.xhtml
    const navPath = path.join(epubDir, 'nav.xhtml')

    if (!fs.existsSync(navPath)) {
      throw new Error('Không tìm thấy file nav.xhtml')
    }

    // Đọc và phân tích file nav.xhtml
    const navContent = fs.readFileSync(navPath, 'utf-8')
    const dom = new JSDOM(navContent)
    const document = dom.window.document

    // Lấy tất cả thẻ li chứa thông tin chương
    const chapterItems = document.querySelectorAll('nav ol li')
    const chapters = []

    chapterItems.forEach((item, index) => {
      const link = item.querySelector('a')
      if (link) {
        const href = decodeURIComponent(link.getAttribute('href'))
        const title = link.textContent.trim()

        chapters.push({
          title: title,
          originalFile: href,
          newFile: `chapter-${index + 1}.html`,
          index: index + 1,
        })
      }
    })

    console.log(`Tìm thấy ${chapters.length} chương`)

    // Copy và đổi tên file theo định dạng chapter-x.html
    chapters.forEach((chapter) => {
      const originalPath = path.join(epubDir, chapter.originalFile)
      const newPath = path.join(chaptersDir, chapter.newFile)

      if (fs.existsSync(originalPath)) {
        try {
          fs.copyFileSync(originalPath, newPath)
          console.log(`Copy và đổi tên: ${chapter.originalFile} -> ${chapter.newFile}`)
        } catch (error) {
          console.error(`Lỗi khi copy file ${chapter.originalFile}:`, error.message)
        }
      } else {
        console.warn(`File không tồn tại: ${chapter.originalFile}`)
      }
    })

    // Tạo danh sách references (tên chương)
    const references = chapters.map((chapter) => chapter.title)

    // Tạo thông tin sách
    const bookInfo = {
      id: bookId,
      name: bookName,
      author: author,
      count: chapters.length,
      references: references,
    }

    // Lưu file JSON thông tin sách
    const bookInfoPath = path.join(outputDir, 'book.json')
    fs.writeFileSync(bookInfoPath, JSON.stringify(bookInfo, null, 2), 'utf-8')

    console.log(`Đã tạo file thông tin sách: ${bookInfoPath}`)
    console.log('Thông tin sách:', bookInfo)

    return {
      success: true,
      message: 'Xử lý EPUB thành công',
      bookInfo: bookInfo,
      chaptersProcessed: chapters.length,
    }
  } catch (error) {
    console.error('Lỗi khi xử lý EPUB:', error.message)
    return {
      success: false,
      message: error.message,
    }
  }
}

/**
 * Hàm chính để chạy từ command line
 */
function main() {
  const args = process.argv.slice(2)

  if (args.length < 4) {
    console.log('Cách sử dụng: node convert-epub.js <epub-directory> <output-directory> <book-id> <book-name> [author]')
    console.log('Ví dụ: node convert-epub.js ./input/cauma ./output/cauma cauma "Cấu Ma" "Tác giả"')
    process.exit(1)
  }

  const epubDir = args[0]
  const outputDir = args[1]
  const bookId = args[2]
  const bookName = args[3]
  const author = args[4] || ''

  if (!fs.existsSync(epubDir)) {
    console.error('Thư mục EPUB không tồn tại:', epubDir)
    process.exit(1)
  }

  console.log('Bắt đầu xử lý EPUB...')
  console.log('Thư mục:', epubDir)
  console.log('Output:', outputDir)
  console.log('ID sách:', bookId)
  console.log('Tên sách:', bookName)
  console.log('Tác giả:', author)
  console.log('---')

  const result = processEpubDirectory(epubDir, outputDir, bookId, bookName, author)

  if (result.success) {
    console.log('✅ Hoàn thành xử lý EPUB')
  } else {
    console.error('❌ Xử lý EPUB thất bại:', result.message)
    process.exit(1)
  }
}

main()
