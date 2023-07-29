interface Fiat {
  eur: number;
}

interface Range {

  max: string;
  min: string;
}

interface TokenBid {
  amount: string;
  amountInFiat: Fiat;
}

interface Token {
  name: string;
  slug: String;
  pictureUrl: string;
  priceRange: Range;
  publicMinPrices: null | any[];
}

interface TokenAuction {
  bestBid: TokenBid;
  currentPrice: string;
  nfts: Token[];
}

interface AuctionUpdateResponse  {
  data: {
    tokenAuctionWasUpdated: TokenAuction;
  };
}
