# 🔥 Alışkanlık Takip

Günlük alışkanlıklarını takip edip seri (streak) tuttuğun bir mobil uygulama. React Native (Expo) + TypeScript.

## Özellikler

- Emoji seçerek yeni alışkanlık ekleme
- Bugünü tek dokunuşla işaretleme
- Son 7 günün görünümü, geçmiş günleri de işaretleyebilme
- Güncel seri sayacı 🔥
- Günlük ilerleme çubuğu (ör. 3 / 5 tamamlandı)
- Veriler cihazda saklanır (AsyncStorage)
- Koyu tema

## Çalıştırma

```bash
npm install
npx expo start
```

Expo Go ile QR kodu okutarak telefonda dene.

## Proje yapısı

```
App.tsx              Ana ekran, ekleme formu, ilerleme
src/
  habits.ts          Veri modeli, seri hesaplama, kaydet/yükle
  HabitCard.tsx      Alışkanlık kartı (7 günlük görünüm)
```

## Seri nasıl hesaplanıyor?

Bugün işaretliyse bugünden, değilse dünden başlayarak geriye doğru kesintisiz işaretli gün sayılır. Böylece gün bitmeden seri "kırılmış" görünmez.
