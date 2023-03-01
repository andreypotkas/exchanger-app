import BTC from '../assets/BTC.png';
import AAVE from '../assets/AAVE.png';
import ADA from '../assets/ADA.png';
import BNB from '../assets/BNB.png';
import DOGE from '../assets/DOGE.png';
import ETH from '../assets/ETH.png';
import HBAR from '../assets/HBAR.png';
import LTC from '../assets/LTC.png';
import MATIC from '../assets/MATIC.png';
import SOL from '../assets/SOL.png';
import XRP from '../assets/XRP.png';

export const setCoinImage = (prop: string) => {
    let img;
    switch(prop){
        case 'BTC': img = BTC; break;
        case 'AAVE': img = AAVE; break;
        case 'BNB': img = BNB; break;
        case 'ETH': img = ETH; break;
        case 'DOGE': img = DOGE; break;
        case 'HBAR': img = HBAR; break;
        case 'LTC': img = LTC; break;
        case 'MATIC': img = MATIC; break;
        case 'SOL': img = SOL; break;
        case 'XRP': img = XRP; break;
        case 'ADA': img = ADA; break;
    }
    
    return img;
}