import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { connectKrakenWebSocket } from '../../services/kraken';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import './Rates.scss';


import { connectCoinbaseWebSocket } from '../../services/coinbase';
import { connectBinanceWebSocket } from '../../services/binance';
import { setCoinImage } from '../../utils/setCoinImage';

const cryptocurrencies: any[] = ['BTC', 'ETH', 'XRP', 'SOL', 'MATIC', 'BNB', 'DOGE', 'LTC', 'ADA', 'HBAR', 'AAVE'];
const exchangers: any[] = ['KRAKEN', 'BINANCE', 'COINBASE'];

const store: any = {};
cryptocurrencies.forEach(item => {
    exchangers.forEach(exchanger => {
        store[item + '_' + exchanger + '_USD'] = '';
    })
})


export default function Rates() {
    const [state, setState] = useState(store);

    const columns = [
        { field: 'KRAKEN', header: 'Kraken' },
        { field: 'COINBASE', header: 'Coinbase',  },
        { field: 'BINANCE', header: 'Binance', }
    ];

    const [visibleColumns, setVisibleColumns] = useState<any[]>(columns);    

    // Init websocket connections
    useEffect(() => {
        const kraken = connectKrakenWebSocket();
        const coinbase = connectCoinbaseWebSocket();
        const binance = connectBinanceWebSocket();

        coinbase.onmessage = (message) => {
            const data = JSON.parse(message.data);              
            const prop = data.product_id?.split('-')[0] as any;
            state[prop + '_COINBASE' + '_USD'] = data.price;
            setState({...state});
        }

        kraken.onmessage = (message) => {
            const data = JSON.parse(message.data);
      
            if (data[2] === 'ticker'){                    
              const prop = data[3]?.split('/')[0].replace('XBT', 'BTC');            
              state[prop + '_KRAKEN' + '_USD'] = data[1].p[0];
              setState({...state});              
            }
        }
        binance.onmessage = (message) => {
            const data = JSON.parse(message.data);
            const prop = data.s?.split('USDT')[0];                        
            state[prop + '_BINANCE' + '_USD'] = data.c;
            setState({...state});
        }
    }, []);

    // Table header columns
    const headerGroup = <ColumnGroup>
                        <Row>
                            <Column header="Currency" frozen />
                            <Column header="Total coin amount" />
                            { visibleColumns.map((col, index) => (
                                <Column key={col.header + index} field={col.field} header={col.header} />
                            )) }
                        </Row>
                    </ColumnGroup>;

    // Table column select header
    const onColumnToggle = (event: any) => {
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter((col) => selectedColumns.some((sCol: any) => sCol.field === col.field));

        setVisibleColumns(orderedSelectedColumns);
    };
    const header = <MultiSelect value={visibleColumns} options={columns} optionLabel="header" onChange={onColumnToggle} className="w-full sm:w-20rem" display="chip" />;
    
    const renderCurrencyTitle = (coin: string) => {
        return (
            <div className='flex gap-2 align-items-center'>
                <img src={setCoinImage(coin)} alt="coin" width={30} height={30} />
                <div>{coin}</div>
            </div>
        )
        
    }

    return (
        <div className="card">
            <DataTable value={cryptocurrencies} headerColumnGroup={headerGroup} header={header} tableStyle={{ minWidth: '50rem', maxWidth:'100%' }}>
                <Column frozen body={ renderCurrencyTitle }/>
                <Column body={ 100000 }/>
                {visibleColumns.map((col: any, index: any) => (
                    <Column key={col.header} field={col.field} body={(data) => state[data + '_' + col.field + '_USD'] }/>
                ))}
            </DataTable>
        </div>
    );
}