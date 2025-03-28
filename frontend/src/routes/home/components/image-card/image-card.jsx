import React from 'react';


/**
 * Thẻ hình ảnh (ImageCard)
 * Hiển thị một thẻ hình ảnh với tên và ảnh điểm đến.
 * @param {Object} props - Các thuộc tính của component.
 * @param {String} props.name - Tên điểm đến.
 * @param {String} props.imageUrl - URL hình ảnh của điểm đến.
 * @param {Function} props.onPopularDestincationCardClick - Hàm xử lý khi nhấn vào thẻ.
 * @returns {JSX.Element} - Thành phần ImageCard.
 */

const ImageCard = (props) => {
  const { name, imageUrl, onPopularDestincationCardClick } = props;
  return (
    <div
      className="p-4 border hover:bg-slate-100 cursor-pointer"
      onClick={() => onPopularDestincationCardClick(name)}
      data-testid="image-card"
    >
      <img src={imageUrl} className="rounded w-[120px] h-[75px]" alt="mumbai" />
      <h4 className="text-center">{name}</h4>
    </div>
  );
};
export default ImageCard;