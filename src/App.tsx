import './App.css'
import sources from './books.json'

function App() {
  return (
    <>
      <h1>TX Books</h1>
      <div style={{ gap: 12, display: 'flex', flexDirection: 'column' }}>
        {sources.map((book) => (
          <button
            onClick={() => {
              navigator.clipboard.writeText(`https://tx-book-source.web.app/${book.file}`)
              alert('Copy thành công!')
            }}>
            {book.name}
          </button>
        ))}
      </div>
    </>
  )
}

export default App
