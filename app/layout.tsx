import "./globals.css";

export const metadata = {
  title: "מד הצדק של סינדי",
  description: "אפליקציה אובייקטיבית לחלוטין שמגיעה תמיד למסקנה הנכונה.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        {/* פונטים אלגנטיים + שובבים */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* כותרות מודרניות */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap"
          rel="stylesheet"
        />

        {/* טקסט תשובות – אלגנטי, דרמטי, קריא */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>{children}</body>
    </html>
  );
  <style>{`
  @keyframes fadeInDramatic {
    0% {
      opacity: 0;
      transform: translateY(10px);
      filter: blur(3px);
    }
    60% {
      opacity: 0.85;
      transform: translateY(2px);
      filter: blur(0px);
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
      filter: blur(0px);
    }
  }
`}</style>
}