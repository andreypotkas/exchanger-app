import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { connectKrakenWebSocket } from '../../services/kraken';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';

interface Product {
    id: string;
    code: string;
    name: string;
    description: string;
    image: string;
    price: number;
    category: string;
    quantity: number;
    inventoryStatus: string;
    rating: number;
}

interface ColumnMeta {
    field: string;
    header: string;
}

const cryptocurrencies: any[] = ['BTC', 'ETH', 'XRP', 'SOL', 'MATIC', 'BNB', 'DOGE', 'LTC', 'ADA', 'HBAR', 'AAVE'];
const initRateItem = { BTC_USD:'', ETH_USD:'', XRP_USD:'', SOL_USD:'', MATIC_USD: '', BNB_USD:'', DOGE_USD:'', LTC_USD: '', ADA_USD: '', HBAR_USD: '', ETH_BTC: '', XRP_BTC:'', SOL_BTC:'', MATIC_BTC: '', BNB_BTC:'', DOGE_BTC:'', LTC_BTC: '', ADA_BTC: '', HBAR_BTC: '', BTC_ETH: '', XRP_ETH:'', SOL_ETH:'', MATIC_ETH: '', BNB_ETH:'', DOGE_ETH:'', LTC_ETH: '', ADA_ETH: '', HBAR_ETH: ''};

export default function Rates() {
    const columns: ColumnMeta[] = cryptocurrencies.map(item => {return { header: item, field: item }});
    const [products, setProducts] = useState<Product[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(columns);
    const KRAKEN_RATES: any = {label: { name:'Kraken', color: 'violet'}, ...initRateItem};

    useEffect(() => {
        setProducts([KRAKEN_RATES]);
        const kraken = connectKrakenWebSocket();
        kraken.onmessage = (message) => {
            const data = JSON.parse(message.data);
      
            if (data[2] === 'ticker'){    
              const prop = data[3]?.replace('/', '_').replace('XBT', 'BTC');            
              KRAKEN_RATES[prop] = { price: data[1].p[0], volume: data[1].v[1] }; 
            }
        }
    }, []);

    let headerGroup = <ColumnGroup>
                        <Row>
                            <Column header="Currency" rowSpan={2} />
                            {visibleColumns.map((col) => (
                                <Column colSpan={2} key={col.field} field={col.field} header={col.header} />
                            ))}
                        </Row>
                        <Row>
                            {visibleColumns.map((col, index) => (
                                <Column key={col.field} field={col.field} header={index % 2 === 0 ? 'price' : 'volume'} />
                            ))}
                            {visibleColumns.map((col, index) => (
                                <Column key={col.field} field={col.field} header={index % 2 === 0 ? 'price' : 'volume'} />
                            ))}
                        </Row>
                    </ColumnGroup>;

    const onColumnToggle = (event: MultiSelectChangeEvent) => {
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter((col) => selectedColumns.some((sCol: ColumnMeta) => sCol.field === col.field));

        setVisibleColumns(orderedSelectedColumns);
    };

    const header = <MultiSelect value={visibleColumns} options={columns} optionLabel="header" onChange={onColumnToggle} className="w-full sm:w-20rem" display="chip" />;

    return (
        <div className="card">
            <DataTable value={products} headerColumnGroup={headerGroup} header={header} tableStyle={{ minWidth: '50rem' }}>

            </DataTable>
        </div>
    );
}