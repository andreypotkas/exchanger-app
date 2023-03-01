import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { connectKrakenWebSocket } from '../../services/kraken';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import './Rates.scss';

import BTC from '../../assets/BTC.png';
import AAVE from '../../assets/AAVE.png';
import ADA from '../../assets/ADA.png';
import BNB from '../../assets/BNB.png';
import DOGE from '../../assets/DOGE.png';
import ETH from '../../assets/ETH.png';
import HBAR from '../../assets/HBAR.png';
import LTC from '../../assets/LTC.png';
import MATIC from '../../assets/MATIC.png';
import SOL from '../../assets/SOL.png';
import XRP from '../../assets/XRP.png';
import { connectCoinbaseWebSocket } from '../../services/coinbase';
import { connectBinanceWebSocket } from '../../services/binance';

interface ColumnMeta {
    field: string;
    header: string;
}

const cryptocurrencies: any[] = ['BTC', 'ETH', 'XRP', 'SOL', 'MATIC', 'BNB', 'DOGE', 'LTC', 'ADA', 'HBAR', 'AAVE'];
const initRateItem = { BTC_USD:'', ETH_USD:'', XRP_USD:'', SOL_USD:'', MATIC_USD: '', BNB_USD:'', DOGE_USD:'', LTC_USD: '', ADA_USD: '', HBAR_USD: '', ETH_BTC: '', XRP_BTC:'', SOL_BTC:'', MATIC_BTC: '', BNB_BTC:'', DOGE_BTC:'', LTC_BTC: '', ADA_BTC: '', HBAR_BTC: '', BTC_ETH: '', XRP_ETH:'', SOL_ETH:'', MATIC_ETH: '', BNB_ETH:'', DOGE_ETH:'', LTC_ETH: '', ADA_ETH: '', HBAR_ETH: ''};

export default function Rates() {
    const columns: ColumnMeta[] = cryptocurrencies.map(item => {return { header: item, field: item + '_USD' }});
    const [visibleColumns, setVisibleColumns] = useState<any[]>(columns.slice(0, 6));
    const [visibleColumns2, setVisibleColumns2] = useState<any[]>([]);

    useEffect(() => {
    
    }, [visibleColumns])

    // Util
    const setImg = (prop: string) => {
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
    
    // Exchangers
    const [krakenRates, setKrakenRates] = useState({label: { name:'Kraken', color: 'violet'}, ...initRateItem} as any);
    const [coinbaseRates, setCoinbaseRates] = useState({label: { name:'Coinbase', color: 'violet'}, ...initRateItem} as any);
    const [binanceRates, setbinanceRates] = useState({label: { name:'Binance', color: 'violet'}, ...initRateItem} as any);

    // Init websocket connections
    useEffect(() => {
        const kraken = connectKrakenWebSocket();
        const coinbase = connectCoinbaseWebSocket();
        const binance = connectBinanceWebSocket();
        coinbase.onmessage = (message) => {
            const data = JSON.parse(message.data);  
            
            const prop = data.product_id?.replace('-', '_');                        
            coinbaseRates[prop] = {price: data.price, volume: data.volume_24h}
            setCoinbaseRates({...coinbaseRates, [prop]: {price: data.price, volume: data.volume_24h}})
        }
        kraken.onmessage = (message) => {
            const data = JSON.parse(message.data);
      
            if (data[2] === 'ticker'){                    
              const prop = data[3]?.replace('/', '_').replace('XBT', 'BTC');            
              krakenRates[prop] = { price: data[1].p[0], volume: data[1].v[1] }
              setKrakenRates({...krakenRates})
            }
        }
        binance.onmessage = (message) => {
            const data = JSON.parse(message.data);
            const prop = data.s?.replace('USDT', '_USD');            
            binanceRates[prop] = {price: data.c, volume: data.v};      
            setbinanceRates({...binanceRates})
        }
    }, []);

    // Table header columns
    const headerGroup = <ColumnGroup>
                        <Row>
                            <Column header="Currency" rowSpan={2} />
                            {visibleColumns.map((col) => (
                                <Column colSpan={2} key={col.field} field={col.field} header={col.header} />
                            ))}
                        </Row>
                        <Row>
                            {visibleColumns2.map((col: any, index: any) => (
                                <Column key={col.field} field={col.field} header={index % 2 === 0 ? 'Price' : 'Volume'} />
                            ))}
                        </Row>
                    </ColumnGroup>;

    // Table column select header
    const onColumnToggle = (event: MultiSelectChangeEvent) => {
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter((col) => selectedColumns.some((sCol: ColumnMeta) => sCol.field === col.field));

        setVisibleColumns(orderedSelectedColumns);
        const x = [] as any;
        orderedSelectedColumns.forEach((item) => {
        x.push(item, item);
    }, []);
    setVisibleColumns2(x);
    };
    const header = <MultiSelect value={visibleColumns} options={columns} optionLabel="header" onChange={onColumnToggle} className="w-full sm:w-20rem" display="chip" />;

    return (
        <div className="card">
            <DataTable value={[krakenRates, coinbaseRates, binanceRates]} headerColumnGroup={headerGroup} header={header} tableStyle={{ minWidth: '50rem', maxWidth:'100%' }}>
            <Column style={{minWidth:'100px', paddingLeft:'20px'}} body={(data) => data.label.name} />
            {visibleColumns2.map((col: any, index: any) => (
                                    <Column key={col.field + index} body={(data) => index % 2 === 0 ? data[col.field].price : data[col.field].volume}/>
                            ))}
            </DataTable>
        </div>
    );
}