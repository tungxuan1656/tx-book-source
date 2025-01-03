import './App.css'

const sources = [
  { file: 'che-tao-sieu-huyen-huyen-the-gioi.zip', name: 'Chế Tạo Siêu Huyền Huyễn Thế Giới' },
  { file: 'dinh-cap-khi-van-lang-le-tu-luyen-ngan-nam.zip', name: 'Đỉnh Cấp Khí Vận, Lặng Lẽ Tu Luyện Ngàn Năm' },
  { file: 'hao-huu-tu-vong-ta-tu-vi-lai-tang-len.zip', name: 'Hảo Hữu Tử Vong Ta Tu Vi Lại Tăng Lên' },
  { file: 'muc-than-ky.zip', name: 'Mục Thần Ký' },
  { file: 'ta-tro-thanh-phu-nhi-dai-phan-phai.zip', name: 'Ta Trở Thành Phú Nhị Đại Phản Phái' },
  {
    file: 'than-hao-thi-len-dai-hoc-he-thong-ban-thuong-muoi-ty.zip',
    name: 'Thần Hào Hệ Thi Lên Đại Học Hệ Thống Ban Thưởng Mười Tỷ',
  },
  { file: 'tien-phu-1.zip', name: 'Tiên Phụ' },
  { file: 'trach-nhat-phi-thang.zip', name: 'Trạch Nhật Phi Thăng' },
  { file: 'van-gioi-chi-rut-thuong-he-thong.zip', name: 'Vạn Giới Chi Rút Thưởng Hệ Thống' },
  { file: 'nhan-to.zip', name: 'Nhân Tổ' },
  { file: 'dai-dao-trieu-thien.zip', name: 'Đại Đạo Triều Thiên' },
]

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
