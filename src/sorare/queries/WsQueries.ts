
export const ACART_UPDATE: string =  `
    tokenAuctionWasUpdated(sports:FOOTBALL){
    currentPrice
    bestBid {
      amount
      amountInFiat {
        eur
      }
    }
    nfts {
      name
      slug
      priceRange {
        min
        max
      }
      pictureUrl
      publicMinPrices {
        eur

      }
    }

  }
    `;

