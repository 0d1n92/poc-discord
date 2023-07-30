interface IFiat {
  eur: number;
}

interface IRange {

  max: string;
  min: string;
}

interface ITokenBid {
  amount: string;
  amountInFiat: IFiat;
}

interface IToken {
  name: string;
  slug: String;
  pictureUrl: string;
  priceRange: IRange;
  publicMinPrices: null | any[];
}

interface ITokenAuction {
  bestBid: ITokenBid;
  currentPrice: string;
  nfts: IToken[];
}

interface IAuctionUpdateResponse  {
  data: {
    tokenAuctionWasUpdated: ITokenAuction;
  };
}
