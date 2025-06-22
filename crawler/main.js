import { crawl } from './utils.js'
import { readFile } from 'fs/promises'

const args = process.argv
const inputFile = args[2]

const BOOK_INFO = JSON.parse(await readFile(inputFile, 'utf8'))
const BASE_URL = `https://metruyencv.com/truyen/${BOOK_INFO.id}/chuong-`
const OUTPUT_FOLDER = `./output/${BOOK_INFO.id}`

global.BOOK_INFO = BOOK_INFO
global.BASE_URL = BASE_URL
global.OUTPUT_FOLDER = OUTPUT_FOLDER

const main = async () => {
  await crawl()
}

main()
