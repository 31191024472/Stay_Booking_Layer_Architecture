import React from 'react';

/**
 * Component Giới thiệu 
 * @returns {jsx}
 */

const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-brand mb-2">Giới thiệu</h1>
      <p className="text-lg mb-8">
        Chào mừng bạn đến với <span className="text-brand">EASY STAY</span>, nơi chúng tôi cam kết mang đến cho bạn
        trải nghiệm đặt phòng khách sạn tốt nhất trên toàn thế giới. Sứ mệnh của chúng tôi là giúp bạn có những chuyến đi
        thoải mái, tiện lợi và đáng nhớ.
      </p>

      <h2 className="text-3xl font-extrabold text-brand mb-2">Tầm nhìn của chúng tôi</h2>
      <p className="text-lg mb-8">
        Tại <span className="text-brand">EASY STAY</span>, chúng tôi hướng đến một thế giới nơi mọi du khách đều có thể tìm thấy
        chỗ ở hoàn hảo phù hợp với nhu cầu và sở thích của mình. Chúng tôi mong muốn đơn giản hóa quy trình đặt phòng khách sạn,
        cung cấp nhiều lựa chọn đa dạng phù hợp với mọi ngân sách.
      </p>

      <h2 className="text-3xl font-extrabold text-brand mb-2">
        TẠI SAO CHỌN CHÚNG TÔI?
      </h2>
      <ul className="list-disc ml-6 mb-8">
        <li className="text-lg mb-3">
            Chúng tôi cung cấp nhiều lựa chọn khách sạn, từ khu nghỉ dưỡng cao cấp đến những chỗ nghỉ nhỏ ấm cúng,
            đảm bảo bạn tìm được nơi phù hợp với phong cách du lịch của mình.
        </li>
        <li className="text-lg mb-3">
            Giao diện thân thiện giúp bạn dễ dàng và nhanh chóng đặt phòng khách sạn lý tưởng. Chỉ với vài cú nhấp chuột,
            bạn có thể đặt phòng mà không gặp bất kỳ rắc rối nào.
        </li>
        <li className="text-lg mb-3">
            Đội ngũ hỗ trợ khách hàng của chúng tôi sẵn sàng phục vụ 24/7 để hỗ trợ bạn với mọi thắc mắc hoặc vấn đề gặp phải
            trong quá trình đặt phòng hoặc lưu trú.
        </li>
        <li className="text-lg mb-3">
            Chúng tôi đặt sự an toàn của thông tin cá nhân và giao dịch của bạn lên hàng đầu. Hãy yên tâm đặt phòng vì dữ liệu của bạn
            luôn được bảo mật tuyệt đối.
        </li>
      </ul>

      <h2 className="text-3xl font-extrabold text-brand mb-2">Liên hệ với chúng tôi</h2>
      <p className="text-lg mb-4">
        Có câu hỏi hoặc cần hỗ trợ? Hãy liên hệ với đội ngũ hỗ trợ khách hàng của chúng tôi qua email{' '}
        <a
          className="text-brand hover:underline"
          href="mailto:info@staybooker.com"
        >
          info@easystay.com
        </a>
        . Chúng tôi luôn sẵn sàng giúp đỡ!
      </p>
      <p className="text-lg">
      Cảm ơn bạn đã lựa chọn <span className="text-brand">EASY STAY</span>. Chúng tôi mong muốn trở thành nền tảng đặt phòng khách sạn hàng đầu của bạn.
      </p>
    </div>
  );
};

export default AboutUs;