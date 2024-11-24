fetch("https://youtube.com")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text(); // Agar JSON formatda bo'lsa, .json() ishlating
  })
  .then((data) => {
    console.log(data); // Ma'lumotni konsolda ko'rsatish
    // Shu yerda olingan ma'lumotni qayta ishlashingiz mumkin
  })
  .catch((error) => {
    console.error("Fetch xatosi:", error);
  });
