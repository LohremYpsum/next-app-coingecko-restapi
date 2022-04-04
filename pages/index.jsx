import Head from 'next/head';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SearchBar from '@/components/layout/SearchBar';
import CoinsList from '@/components/CoinsList';
import PiechartMarketCap from '@/components/charts/PiechartMarketCap';
import BarchartCirculatingSupply from '@/components/charts/BarchartCirculatingSupply';
import BarchartAthChange from '@/components/charts/BarchartAthChange';
import PiechartTradeVolume from '@/components/charts/PiechartTradeVolume';

// Call API Endpoint via ServerSideProps
/* export const getServerSideProps = async ({ query }) => {
  //first page is default
  const page = query.page || 1;
  let coinsData = null;

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?&page=1&per_page=14&vs_currency=usd&order=market_cap_desc&sparkline=false&price_change_percentage=24h%2C7d%2C30d`
    );
    if (res.status !== 200) {
      throw new Error('Failed to fetch');
    }
    coinsData = await res.json();
  } catch (err) {
    coinsData = { error: { message: err.message } };
  }

  return {
    props: {
      coinsData,
    },
  };
}; */

export default function Home() {
  const [search, setSearch] = useState('');

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [coinsData, setCryptos] = useState([]);

  // Button Clicker
  const initResults = 10;
  const initPage = 1;
  const initCurrency = 'eur';
  const [count, setCount] = useState(initResults);
  const [page, setPage] = useState(initPage);
  const [currency, setCurrency] = useState(initCurrency); // eur is true
  const nextPage = () => setPage(page + 1);
  const previousPage = () => setPage((currentCount) => currentCount - 1);
  const changeCurrency = () =>
    setCurrency((currentCurrency) => !currentCurrency);

  // Call API Endpoint via useEffect
  useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?&page=${page}&per_page=${count}&vs_currency=${
        currency ? 'eur' : 'usd'
      }&order=market_cap_desc&sparkline=false&price_change_percentage=24h%2C7d%2C30d`
    )
      .then((res) => res.json())
      .then(
        (cryptoData) => {
          setIsLoaded(true);
          setCryptos(cryptoData);
          //console.log(cryptoData);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [count, page, currency]);

  const filteredCoins = coinsData.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  //Searchbar Handler
  const searchList = (event) => {
    event.preventDefault();
    setSearch(event.target.value.toLowerCase());
  };

  return (
    <Layout title="Crypto Metrics">
      <SearchBar type="text" placeholder="Search" onChange={searchList} />
      Currency:{' '}
      <button className="custom-btn btn-15" onClick={changeCurrency}>
        {currency ? '€' : '$'}
      </button>
      <CoinsList coinsData={filteredCoins} />
      <div className="flex-container flex-align-right">
        <div>
          <button className="custom-btn btn-15" onClick={previousPage}>
            Previous
          </button>
          <button className="custom-btn btn-15" onClick={nextPage}>
            Next
          </button>
        </div>
      </div>
      <div className="flex-container">
        <PiechartMarketCap
          chartTitle="Marktkapitalisierung (Abs. Zahlen)"
          cryptos={filteredCoins}
        />
        <BarchartCirculatingSupply
          chartTitle="Umlaufmenge (Abs. Zahlen)"
          cryptos={filteredCoins}
        />
      </div>
      <div className="flex-container">
        <BarchartAthChange
          title="ATH Veränderung in %"
          cryptos={filteredCoins}
        />
        <PiechartTradeVolume
          title="Aktuelles Handelsvolumen (Abs. Zahlen)"
          cryptos={filteredCoins}
        />
      </div>
    </Layout>
  );
}
