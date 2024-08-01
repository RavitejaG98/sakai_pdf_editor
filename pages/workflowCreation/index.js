import React, { useEffect, useState } from 'react';
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

export const InputDemo = () => {
    const [floatValue, setFloatValue] = useState('');
    const [autoValue, setAutoValue] = useState(null);
    const [selectedAutoValue, setSelectedAutoValue] = useState(null);
    const [autoFilteredValue, setAutoFilteredValue] = useState([]);
    const [calendarValue, setCalendarValue] = useState(null);
    const [inputNumberValue, setInputNumberValue] = useState(null);
    const [chipsValue, setChipsValue] = useState([]);
    const [sliderValue, setSliderValue] = useState('');
    const [ratingValue, setRatingValue] = useState(null);
    const [colorValue, setColorValue] = useState('1976D2');
    const [knobValue, setKnobValue] = useState(20);
    const [radioValue, setRadioValue] = useState(null);
    const [checkboxValue, setCheckboxValue] = useState([]);
    const [switchValue, setSwitchValue] = useState(false);
    const [listboxValue, setListboxValue] = useState(null);
    const [dropdownValue, setDropdownValue] = useState(null);
    const [multiselectValue, setMultiselectValue] = useState([{ name: 'WIP', code: 'AU' },
    { name: 'Approve', code: 'BR' },
    { name: 'Release', code: 'CN' },]);
    const [toggleValue, setToggleValue] = useState(false);
    const [selectButtonValue1, setSelectButtonValue1] = useState(null);
    const [selectButtonValue2, setSelectButtonValue2] = useState(null);
    const [inputGroupValue, setInputGroupValue] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [treeSelectNodes, setTreeSelectNodes] = useState(null);
    const [stageName, setStageName] = useState('')

    const listboxValues = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    const dropdownValues = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    const [multiselectValues, setMultiselectValues] = useState([
        { name: 'WIP', code: 'AU' },
        { name: 'Approve', code: 'BR' },
        { name: 'Release', code: 'CN' },
    ]);



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

    const onCheckboxChange = (e) => {
        let selectedValue = [...checkboxValue];
        if (e.checked) selectedValue.push(e.value);
        else selectedValue.splice(selectedValue.indexOf(e.value), 1);

        setCheckboxValue(selectedValue);
    };

    const itemTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <span>{option.name}</span>
            </div>
        );
    };

    return (
        <div className="grid p-fluid">
            <div className="col-12 md:col-12">
                <div className="card">
                    <h5>Work Flow Creation</h5>
                    <div className="grid formgrid">
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <h6>Workflow Name</h6>
                            <InputText type="text" placeholder="workflow name"></InputText>
                        </div>
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <h6>Workflow Description</h6>
                            <InputText type="text" placeholder="workflow Description" ></InputText>
                        </div>

                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <h6>Stages</h6>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{ flex: 6 }}>
                                    <InputText type="text" value={stageName} placeholder="stage" onChange={(e) => { setStageName(e.target.value) }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Button icon='pi pi-add' label='Add' onClick={() => {
                                        console.log(stageName, multiselectValue)
                                        setMultiselectValues((prev) => [...prev, { "name": stageName, "code": 'new' }]);
                                        setStageName('');

                                    }} />
                                </div>
                            </div>
                            <hr />
                            <MultiSelect value={multiselectValue} onChange={(e) => { setMultiselectValue(e.value); console.log(multiselectValue) }} options={multiselectValues} optionLabel="name" placeholder="Select Stages" filter display="chip" itemTemplate={itemTemplate} />

                        </div>
                        <h5>Define Stages</h5>
                        <div className="col-12 mb-12 lg:col-12 lg:mb-0">
                            {multiselectValue.length != 0 && <div className="col-12">
                                <div className="grid formgrid">
                                    {multiselectValue.map((item, index) => <div key={index} className="card col-12 mb-2 lg:col-4 lg:mb-0 p-4 mx-1">
                                        <h5>{item.name}</h5>
                                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                                            <h6>Stage Duration</h6>
                                            <InputText type="text" placeholder="Stage Duration" ></InputText>
                                        </div>
                                        <hr/>
                                        <br/>
                                        <AutoComplete placeholder="Search" id="dd" dropdown multiple value={selectedAutoValue} onChange={(e) => { setSelectedAutoValue(e.value) }} suggestions={autoFilteredValue} completeMethod={searchCountry} field="name" />
                                    </div>)}
                                </div>
                            </div>}
                        </div>
                    </div>




                </div>


            </div>



        </div>
    );
};

export default InputDemo;
