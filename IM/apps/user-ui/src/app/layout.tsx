import Header from '../shared/widgets/header';
import './global.css';

export const metadata = {
  title: 'Infinite_Market',
  description: 'ecommerce',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        </body>
    </html>
  );
}
