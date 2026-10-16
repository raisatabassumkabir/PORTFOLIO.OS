import { getPortfolioData } from '@/lib/portfolio-service';
import { PortfolioClientView } from './PortfolioClientView';

export default async function Page() {
  const data = await getPortfolioData();

  return <PortfolioClientView data={data} />;
}
