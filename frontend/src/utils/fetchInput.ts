export const fetchMissionData = async () => {
  try {
    const response = await fetch("./datasets/input.json");
    if (!response.ok) throw new Error("Veri yüklenemedi");

    const data = await response.json(); // .text() yerine doğrudan .json() kullanıyoruz
    return data;
  } catch (err) {
    console.error("Görev verisi çekilirken hata oluştu:", err);
    return null;
  }
};
