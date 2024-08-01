import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { Chips } from 'primereact/chips';
import { Slider } from 'primereact/slider';
import { Knob } from 'primereact/knob';
import { Rating } from 'primereact/rating';
import { ColorPicker } from 'primereact/colorpicker';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { InputSwitch } from 'primereact/inputswitch';
import { ListBox } from 'primereact/listbox';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';
import { MultiSelect } from 'primereact/multiselect';
import { TreeSelect } from 'primereact/treeselect';
import { SelectButton } from 'primereact/selectbutton';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { CountryService } from '../../demo/service/CountryService';
import { NodeService } from '../../demo/service/NodeService';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
export const InputDemo = () => {
    const [floatValue, setFloatValue] = useState('');
    const [autoValue, setAutoValue] = useState(null);
    const [selectedAutoValue, setSelectedAutoValue] = useState(null);
    const [selectedAutoValue1, setSelectedAutoValue1] = useState(null);

    const [selectedAutoValue2, setSelectedAutoValue2] = useState(null);

    const [selectedAutoValue3, setSelectedAutoValue3] = useState(null);


    const [selectedAutoValue4, setSelectedAutoValue4] = useState(null);

    const [autoFilteredValue, setAutoFilteredValue] = useState([]);
    const [calendarValue, setCalendarValue] = useState(null);
    const [inputNumberValue, setInputNumberValue] = useState(null);
    const [chipsValue, setChipsValue] = useState([]);
    const [sliderValue, setSliderValue] = useState('');
    const [ratingValue, setRatingValue] = useState(null);
    const [colorValue, setColorValue] = useState('1976D2');
    const [knobValue, setKnobValue] = useState(20);
    const [radioValue, setRadioValue] = useState(null);
    const [checkboxValue, setCheckboxValue] = useState({});
    const [switchValue, setSwitchValue] = useState(false);
    const [listboxValue, setListboxValue] = useState(null);
    const [dropdownValue, setDropdownValue] = useState(null);
    const [multiselectValue, setMultiselectValue] = useState(null);
    const [toggleValue, setToggleValue] = useState(false);
    const [selectButtonValue1, setSelectButtonValue1] = useState(null);
    const [selectButtonValue2, setSelectButtonValue2] = useState(null);
    const [inputGroupValue, setInputGroupValue] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [treeSelectNodes, setTreeSelectNodes] = useState(null);
    const toast = useRef(null);
    const listboxValues = [
        { name: 'Work flow 1', code: 'NY' },
        { name: 'Work flow 2', code: 'RM' },
        { name: 'Work flow 3', code: 'LDN' },
        { name: 'Work flow 4', code: 'IST' },
        { name: 'Work flow 5', code: 'PRS' }
    ];

    const dropdownValues = [
        { name: 'Work flow 1', code: 'NY' },
        { name: 'Work flow 2', code: 'RM' },
        { name: 'Work flow 3', code: 'LDN' },
        { name: 'Work flow 4', code: 'IST' },
        { name: 'Work flow 5', code: 'PRS' }
    ];

    const multiselectValues = [
        { name: 'Australia', code: 'AU' },
        { name: 'Brazil', code: 'BR' },
        { name: 'China', code: 'CN' },
        { name: 'Egypt', code: 'EG' },
        { name: 'France', code: 'FR' },
        { name: 'Germany', code: 'DE' },
        { name: 'India', code: 'IN' },
        { name: 'Japan', code: 'JP' },
        { name: 'Spain', code: 'ES' },
        { name: 'United States', code: 'US' }
    ];

    const selectButtonValues1 = [
        { name: 'Option 1', code: 'O1' },
        { name: 'Option 2', code: 'O2' },
        { name: 'Option 3', code: 'O3' }
    ];

    const selectButtonValues2 = [
        { name: 'Option 1', code: 'O1' },
        { name: 'Option 2', code: 'O2' },
        { name: 'Option 3', code: 'O3' }
    ];

    useEffect(() => {
        CountryService.getCountries().then((data) => setAutoValue(data));
        NodeService.getTreeNodes().then((data) => setTreeSelectNodes(data));
    }, []);

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

    const onCheckboxChange = (e, i) => {
        console.log('e.value')
        const temp = { ...checkboxValue, [i]: e.checked }
        setCheckboxValue(temp);
        console.log('check box values', checkboxValue)
    };

    const itemTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <span className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px', height: '12px' }} />
                <span>{option.name}</span>
            </div>
        );
    };

    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    };
    const onCreateTable = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Table created Succesfully', life: 3000 });
    };

    const onCheckin = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Diagram checkin created succesfully', life: 3000 });
        setCheckboxValue({});
        setSelectedAutoValue3('')
        setSelectedAutoValue1('')
        setSelectedAutoValue2('')
        setSelectedAutoValue4('')

    };
    return (
        <div className="grid p-fluid">
            <Toast ref={toast}></Toast>
            <div className="col-12 ">
                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'lightblue', borderRadius: 5, padding: 4 }}>create New Check-In</h3>
                    <hr />
                    <div className="grid formgrid">

                        <div className="col-12 mb-2 lg:col-12 lg:mb-0">
                            <h5>Upload Drawing File</h5>

                            <FileUpload name="demo[]" url="/api/upload" onUpload={onUpload} multiple accept="image/*" maxFileSize={1000000} />
                        </div>
                        <hr />
                        <div className="col-12 mb-2 lg:col-12 lg:mb-0">
                            <h5>upload Drawing File - PDF</h5>

                            <FileUpload name="demo[]" url="/api/upload" onUpload={onUpload} multiple accept="image/*" maxFileSize={1000000} />
                        </div>

                    </div>

                    <hr />
                    <div className="grid formgrid">
                        <div className="col-12 mb-2 lg:col-12 lg:mb-0">
                            <h5>Upload Drawing Attachments</h5>
                            <FileUpload name="demo[]" url="/api/upload" onUpload={onUpload} multiple accept="image/*" maxFileSize={1000000} />

                        </div>

                    </div>

                    <h5>Select Workflow</h5>
                    <span className="p-float-label">
                        <Dropdown value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} optionLabel="name" placeholder="Select" />
                    </span>

                    {/* <h5>Description</h5>
                    <InputTextarea placeholder="Your Message" autoResize rows="3" cols="30" /> */}

                    <h5>Assign Roles</h5>
                    {dropdownValue != null &&  <div className="col-12">
                        <div className="grid formgrid">
                            <div className="card col-12 mb-2 lg:col-4 lg:mb-0 p-4">
                                <h5>Div-Review</h5>
                                {/* <div className="field-checkbox">
                                    <Checkbox inputId="checkOption1" name="option" value="true" checked={Boolean(checkboxValue[0])} onChange={(e) => onCheckboxChange(e, 0)} />
                                    <label htmlFor="checkOption1">Require Signature</label>
                                </div> */}
                                <AutoComplete placeholder="Search" id="dd" dropdown multiple value={selectedAutoValue} onChange={(e) => setSelectedAutoValue(e.value)} suggestions={autoFilteredValue} completeMethod={searchCountry} field="name" />
                            </div>
                            <div className="card col-12 mb-2 lg:col-4 lg:mb-0 p-4">
                                <h5>Div-Approve</h5>
                                <div className="field-checkbox">
                                    <Checkbox inputId="checkOption1" name="option" value="true" checked={Boolean(checkboxValue[1])} onChange={(e) => onCheckboxChange(e, 1)} />
                                    <label htmlFor="checkOption1">Require Signature</label>
                                </div>
                                <AutoComplete placeholder="Search" id="dd" dropdown multiple value={selectedAutoValue1} onChange={(e) => setSelectedAutoValue1(e.value)} suggestions={autoFilteredValue} completeMethod={searchCountry} field="name" />
                            </div>
                            <div className="card col-12 mb-2 lg:col-4 lg:mb-0 p-4">
                                <h5>HQ-Review</h5>
                                {/* <div className="field-checkbox">
                                    <Checkbox inputId="checkOption1" name="option" value="true" checked={Boolean(checkboxValue[2])} onChange={(e) => onCheckboxChange(e, 2)} />
                                    <label htmlFor="checkOption1">Require Signature</label>
                                </div> */}
                                <AutoComplete placeholder="Search" id="dd" dropdown multiple value={selectedAutoValue2} onChange={(e) => setSelectedAutoValue2(e.value)} suggestions={autoFilteredValue} completeMethod={searchCountry} field="name" />
                            </div>
                        </div>
                        <div className="grid formgrid">
                            <div className="card col-12 mb-2 lg:col-4 lg:mb-0 p-4">
                                <h5>HQ-Approve</h5>
                                <div className="field-checkbox">
                                    <Checkbox inputId="checkOption1" name="option" value="true" checked={Boolean(checkboxValue[3])} onChange={(e) => onCheckboxChange(e, 3)} />
                                    <label htmlFor="checkOption1">Require Signature</label>
                                </div>
                                <AutoComplete placeholder="Search" id="dd" dropdown multiple value={selectedAutoValue3} onChange={(e) => setSelectedAutoValue3(e.value)} suggestions={autoFilteredValue} completeMethod={searchCountry} field="name" />
                            </div>
                            <div className="card col-12 mb-2 lg:col-4 lg:mb-0 p-4">
                                <h5>Release</h5>
                                <div className="field-checkbox">
                                    <Checkbox inputId="checkOption1" name="option" value="true" checked={Boolean(checkboxValue[4])} onChange={(e) => onCheckboxChange(e, 4)} />
                                    <label htmlFor="checkOption1">Require Signature</label>
                                </div>
                                <AutoComplete placeholder="Search" id="dd" dropdown multiple value={selectedAutoValue4} onChange={(e) => setSelectedAutoValue4(e.value)} suggestions={autoFilteredValue} completeMethod={searchCountry} field="name" />
                            </div>
                        </div>

                    </div> }
                    {  dropdownValue == null &&<h3 style={{ display : "flex", justifyContent : 'center', color : 'gray', padding :4 , backgroundColor : 'whitesmoke'}}>Please select work flow</h3>}
                    <hr />

                    <div className="grid formgrid">
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <Button  icon="pi pi-table" label="Create Signature Table" onClick={onCreateTable} />
                        </div>
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <Button icon="pi pi-check" label="Checkin" severity="success" onClick={onCheckin} />
                        </div>
                    </div>

                </div>


            </div>

        </div>
    );
};

export default InputDemo;
