import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { ToggleButton } from 'primereact/togglebutton';
import { Rating } from 'primereact/rating';
import { CustomerService } from '../../demo/service/CustomerService';
import { ProductService } from '../../demo/service/ProductService';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { InputTextarea } from 'primereact/inputtextarea';
import { AutoComplete } from 'primereact/autocomplete';
import { Checkbox } from 'primereact/checkbox';
import { CountryService } from '../../demo/service/CountryService';
import { NodeService } from '../../demo/service/NodeService';
import PDFComponent from '../../demo/components/PDFComponentMACComplete'
import { Grid } from 'primereact/column';
import { Tooltip } from 'primereact/tooltip';

const TableDemo = () => {

    const [customers1, setCustomers1] = useState(null);
    const [customers2, setCustomers2] = useState([]);
    const [customers3, setCustomers3] = useState([]);
    const [filters1, setFilters1] = useState(null);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [idFrozen, setIdFrozen] = useState(false);
    const [products, setProducts] = useState([]);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const [expandedRows, setExpandedRows] = useState(null);
    const [allExpanded, setAllExpanded] = useState(false);
    const [dropdownValue, setDropdownValue] = useState(null);
    const [checkboxValue, setCheckboxValue] = useState([]);
    const [selectedAutoValue, setSelectedAutoValue] = useState(null);
    const [autoFilteredValue, setAutoFilteredValue] = useState([]);
    const [autoValue, setAutoValue] = useState(null);
    const [treeSelectNodes, setTreeSelectNodes] = useState(null);
    const [multiselectValue, setMultiselectValue] = useState(null);
    const [toastMessage, setToastMessage] = useState('');
    const [isToastVisible, setIsToastVisible] = useState(false);
    const showToast = (message) => {
        setToastMessage(message);
        setIsToastVisible(true);
    };

    const hideToast = () => {
        setIsToastVisible(false);
    };
    const [text, setText] = useState('');
    const [items, setItems] = useState(['placement is off by 1mt', 'make the angle 2 degree less', 'material is defective']);

    const handleAddItem = () => {
        if (text) {
            setItems([...items, text]);
            setText('');
        }
    };

    const handleEditItem = (index, newText) => {
        const updatedItems = [...items];
        updatedItems[index] = newText;
        setItems(updatedItems);
    };

    const handleDeleteItem = (index) => {
        const updatedItems = items.filter((item, i) => i !== index);
        setItems(updatedItems);
    };

    const multiselectValues = [
        { name: 'make the lenght 0.6m' },
        { name: 'write the breadth info' },
        { name: 'unnessecary' },
        { name: 'not useful' },
        { name: 'can\'t use this material' },
        { name: 'N/A' },
    ];

    const itemTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <span>{option.name}</span>
            </div>
        );
    };
    const toast = useRef(null);
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '10px',
        padding: '10px'
    };
    const [visible, setVisible] = useState(false);

    const showDialog = () => {
        setVisible(true);
    };
    const searchCountry = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setAutoFilteredValue([...autoValue]);
            } else {
                setAutoFilteredValue(
                    autoValue.filter((country) => {
                        return country.name.toLowerCase().startsWith(event.query.toLowerCase());
                    })
                );
            }
        }, 250);
    };
    const hideDialog = () => {
        setVisible(false);
    };
    const representatives = [
        { name: 'Amy Elsner', image: 'amyelsner.png' },
        { name: 'Anna Fali', image: 'annafali.png' },
        { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
        { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
        { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
        { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
        { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
        { name: 'Onyama Limba', image: 'onyamalimba.png' },
        { name: 'Stephen Shaw', image: 'stephenshaw.png' },
        { name: 'XuXue Feng', image: 'xuxuefeng.png' }
    ];
    useEffect(() => {
        CountryService.getCountries().then((data) => setAutoValue(data));
        NodeService.getTreeNodes().then((data) => setTreeSelectNodes(data));
    }, []);

    const statuses = ['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'];

    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    };
    const clearFilter1 = () => {
        initFilters1();
    };

    const onGlobalFilterChange1 = (e) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        _filters1['global'].value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };

    const renderHeader1 = () => {
        return (
            <div className={gridStyle}>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter1} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    useEffect(() => {
        setLoading2(true);

        CustomerService.getCustomersLargeP().then((data) => {
            setCustomers1(getCustomers(data));
            setLoading1(false);
        });
        CustomerService.getCustomersLargeP().then((data) => {
            setCustomers2(getCustomers(data));
            setLoading2(false);
        });
        CustomerService.getCustomersMedium().then((data) => setCustomers3(data));
        ProductService.getProductsWithOrdersSmall().then((data) => setProducts(data));

        initFilters1();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const balanceTemplate = (rowData) => {
        return (
            <div>
                <span className="text-bold">{formatCurrency(rowData.balance)}</span>
            </div>
        );
    };

    const getCustomers = (data) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);
            return d;
        });
    };

    const formatDate = (value) => {
        return value
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'category.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue1('');
    };

    const countryBodyTemplate = (rowData) => {
        return (
            <React.Fragment>

                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{rowData.category.name}</span>
            </React.Fragment>
        );
    };

    const filterClearTemplate = (options) => {
        return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} severity="secondary"></Button>;
    };

    const filterApplyTemplate = (options) => {
        return <Button type="button" icon="pi pi-check" onClick={options.filterApplyCallback} severity="success"></Button>;
    };
    const onCheckboxChange = (e) => {
        let selectedValue = [...checkboxValue];
        if (e.checked) selectedValue.push(e.value);
        else selectedValue.splice(selectedValue.indexOf(e.value), 1);

        setCheckboxValue(selectedValue);
    };
    const representativeBodyTemplate = (rowData) => {
        const representative = rowData.checkin;
        return (
            <React.Fragment>

                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{representative.name}</span>
            </React.Fragment>
        );
    };

    const representativeFilterTemplate = (options) => {
        return (
            <>
                <div className="mb-3 text-bold">Agent Picker</div>
                <MultiSelect value={options.value} options={representatives} itemTemplate={representativesItemTemplate} onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="Any" className="p-column-filter" />
            </>
        );
    };

    const representativesItemTemplate = (option) => {
        return (
            <div className="p-multiselect-representative-option">
                <img alt={option.name} src={`/demo/images/avatar/${option.image}`} width={32} style={{ verticalAlign: 'middle' }} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{option.name}</span>
            </div>
        );
    };

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.version);
    };

    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const balanceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.alteration);
    };

    const balanceFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="USD" locale="en-US" />;
    };

    const statusBodyTemplate = (rowData) => {
        return <div >  <div>
            <Button icon="pi pi-info-circle" className="p-button-rounded" aria-label="Info" id="infobutton" />
            <Tooltip target="#infobutton" content="Display Info about the drawing" position="top" />
            <Button icon="pi pi-paperclip" className="p-button-rounded" aria-label="Add Attachments" id="attachments" />
            <Tooltip target="#attachments" content="Add Attachments" position="top" />
            <Button icon="pi pi-eye" className="p-button-rounded" aria-label="View Attachment" id="viewattachments" />
            <Tooltip target="#viewattachments" content="Display Attachments" position="top" />
        </div></div>;
    };

    const statusFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;
    };

    const statusItemTemplate = (option) => {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    };

    const activityBodyTemplate = (rowData) => {
        return <div>
            <Button icon="pi pi-book" className="p-button-rounded " id="viewothers" onClick={showDialog} />
            <Tooltip target="#viewothers" content="View markup & commment" position="top" />
            <Button icon="pi pi-exclamation-triangle" className="p-button-rounded" id="raiseissue" />
            <Tooltip target="#raiseissue" content="Raise Issue" position="top" />
            <Button icon="pi pi-trash" className="p-button-rounded" id="reject" severity='danger' />
            <Tooltip target="#reject" content="Reject drawing" position="top" />
        </div>
    };

    const activityFilterTemplate = (options) => {
        return (
            <React.Fragment>
                <Slider value={options.value} onChange={(e) => options.filterCallback(e.value)} range className="m-3"></Slider>
                <div className="flex align-items-center justify-content-between px-2">
                    <span>{options.value ? options.value[0] : 0}</span>
                    <span>{options.value ? options.value[1] : 100}</span>
                </div>
            </React.Fragment>
        );
    };

    const verifiedBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.verified, 'text-pink-500 pi-times-circle': !rowData.verified })}></i>;
    };

    const verifiedFilterTemplate = (options) => {
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value)} />;
    };

    const toggleAll = () => {
        if (allExpanded) collapseAll();
        else expandAll();
    };

    const expandAll = () => {
        let _expandedRows = {};
        products.forEach((p) => (_expandedRows[`${p.id}`] = true));

        setExpandedRows(_expandedRows);
        setAllExpanded(true);
    };

    const collapseAll = () => {
        setExpandedRows(null);
        setAllExpanded(false);
    };

    const amountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.amount);
    };

    const statusOrderBodyTemplate = (rowData) => {
        return <span className={`order-badge order-${rowData.status.toLowerCase()}`}>{rowData.status}</span>;
    };

    const searchBodyTemplate = () => {
        return <Button icon="pi pi-search" />;
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={`/demo/images/product/${rowData.image}`} onError={(e) => (e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')} alt={rowData.image} className="shadow-2" width={100} />;
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    };

    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    };

    const statusBodyTemplate2 = (rowData) => {
        return <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h5>Orders for {data.name}</h5>
                <DataTable value={data.orders} responsiveLayout="scroll">
                    <Column field="id" header="Id" sortable></Column>
                    <Column field="customer" header="Customer" sortable></Column>
                    <Column field="date" header="Date" sortable></Column>
                    <Column field="amount" header="Amount" body={amountBodyTemplate} sortable></Column>
                    <Column field="status" header="Status" body={statusOrderBodyTemplate} sortable></Column>
                    <Column headerStyle={{ width: '4rem' }} body={searchBodyTemplate}></Column>
                </DataTable>
            </div>
        );
    };

    const header = <Button icon={allExpanded ? 'pi pi-minus' : 'pi pi-plus'} label={allExpanded ? 'Collapse All' : 'Expand All'} onClick={toggleAll} className="w-11rem" />;

    const headerTemplate = (data) => {
        return (
            <React.Fragment>
                <img alt={data.representative.name} src={`/demo/images/avatar/${data.representative.image}`} width="32" style={{ verticalAlign: 'middle' }} />
                <span className="font-bold ml-2">{data.representative.name}</span>
            </React.Fragment>
        );
    };

    const footerTemplate = (data) => {
        return (
            <React.Fragment>
                <td colSpan="4" style={{ textAlign: 'right' }} className="text-bold pr-6">
                    Total Customers
                </td>
                <td>{calculateCustomerTotal(data.representative.name)}</td>
            </React.Fragment>
        );
    };

    const calculateCustomerTotal = (name) => {
        let total = 0;

        if (customers3) {
            for (let customer of customers3) {
                if (customer.representative.name === name) {
                    total++;
                }
            }
        }

        return total;
    };

    const header1 = renderHeader1();

    return (
        <div className="grid">
            <div>
                <Dialog header="upload Markup PDF" visible={visible} style={{ width: '100vw' }} onHide={hideDialog}>

                    <Toast ref={toast}></Toast>
                    <Toast
                        message={toastMessage}
                        isVisible={isToastVisible}
                        onClose={hideToast}
                    />

                    <div style={{ display: 'flex', }}>
                        <div style={{ flex: 2, backgroundColor: 'lightred', margin: 5 }}>
                            <PDFComponent />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '50vh' }}>
                            {/* <div style={{ display: 'flex', padding: '1em', alignItems: 'center' }}>
                                <InputText
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Enter Comment"
                                    style={{ marginRight: '0.5em', flexGrow: 1 }}
                                />
                                <Button label="Add" onClick={handleAddItem} />
                            </div> */}
                            <div style={{ padding: '1em' }}>
                                <h4>Comments</h4>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1em' }}>
                                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                                    {items.map((item, index) => (
                                        <li key={index} style={{ padding: '0.5em 0', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
                                            <InputText
                                                disabled
                                                value={item}
                                                onChange={(e) => handleEditItem(index, e.target.value)}
                                                style={{ marginRight: '0.5em', flexGrow: 1 }}
                                            />
                                            {(index % 2 == 0) ? <Button icon="pi pi-check" className="p-button-rounded p-button-success"
                                            /> : <Button icon="pi pi-thumbs-down" className="p-button-rounded p-button-danger"
                                            />}
                                        </li>
                                    ))}
                                </ul>
                            </div>


                        </div>
                    </div>
                    {/* <div>
                    <Button
                                onClick={() => showToast('Signature Table has been finalised and drawing succesfully checked in')}
                                className="bg-blue-500 text-white p-2 rounded mx-20"
                            >
                                Finalise MarkUp and Comment
                            </Button >
                            <Button label="Submit Comments"/>
                    </div> */}

                </Dialog>
            </div>
            <div className="col-12">
                <div className="card">
                    <h5>Filter Menu</h5>
                    <DataTable
                        value={customers1}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        filters={filters1}
                        filterDisplay="menu"
                        loading={loading1}
                        responsiveLayout="scroll"
                        emptyMessage="No customers found."
                        header={header1}
                    >
                        <Column field="sno" header="S.no" filter filterPlaceholder="Search by Serial No." style={{ minWidth: '12rem' }} />
                        <Column field="drawingNo" header="Drawing No." filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                        <Column header="Category" filterField="category.name" style={{ minWidth: '12rem' }} body={countryBodyTemplate} filter filterPlaceholder="Search by Category" filterClear={filterClearTemplate} filterApply={filterApplyTemplate} />
                        <Column
                            header="Checkin"
                            filterField="checkin"
                            showFilterMatchModes={false}
                            filterMenuStyle={{ width: '14rem' }}
                            style={{ minWidth: '14rem' }}
                            body={representativeBodyTemplate}
                            filter
                            filterElement={representativeFilterTemplate}
                        />
                        <Column header="Version" filterField="version" style={{ minWidth: '10rem' }} body={dateBodyTemplate} filter filterElement={dateFilterTemplate} />
                        <Column header="alteration" filterField="alteration" style={{ minWidth: '10rem' }} body={balanceBodyTemplate} filter filterElement={balanceFilterTemplate} />
                        <Column field="Details" header="Details" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
                        <Column field="actions" header="Actions" showFilterMatchModes={false} style={{ minWidth: '12rem' }} body={activityBodyTemplate} filter filterElement={activityFilterTemplate} />

                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default TableDemo;
