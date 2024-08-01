import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
const RegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dob, setDob] = useState(null);
    const [division, setDivision] = useState(null);
    const [Zone, setZone] = useState(null);
    const [stages, setStages] = useState(['Planning', 'Development', 'Testing']);
    const [roles, setRoles] = useState([]);

    const [inputValue, setInputValue] = useState('');
    const [stringsArray, setStringsArray] = useState([]);

    const handleAddString = () => {
        if (inputValue.trim() !== '') {
            setStringsArray([...stringsArray, inputValue]);
            setInputValue('');
        }
    };
    const divisions = [
        { label: 'Division 1', value: 'Division 1' },
        { label: 'Division 2', value: 'Division 2' },
        { label: 'Division 3', value: 'Division 3' }
    ];

    const Zones = [
        { label: 'Zone 1', value: 'Zone 1' },
        { label: 'Zone 2', value: 'Zone 2' },
        { label: 'Zone 3', value: 'Zone 3' }
    ];

    const stagesOptions = [
        { label: 'Planning', value: 'Planning' },
        { label: 'Development', value: 'Development' },
        { label: 'Testing', value: 'Testing' },
        { label: 'Deployment', value: 'Deployment' }
    ];

    const [roleOptions, setRoleOptions] = useState([
        { label: 'Drawing Creator', value: 'Drawing Creator' },
        { label: 'Drawing Reviewer', value: 'Drawing Reviwer' },
        { label: 'Drawing Approver', value: 'Drawing Approver' },
        { label: 'Release Manager', value: 'Release Manager' },
        { label: 'Workflow Manager', value: 'Workflow Manager' },
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ username, email, password, confirmPassword, dob, division, Zone, stages });
    };

    return (
        <form onSubmit={handleSubmit} className="p-grid p-fluid">
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>create New Role</h5>
                    <div>
                        <div className="" style={{display : 'flex', flexDirection : 'row'}}>
                            <div className="p-col-12 p-md-8" style={{flex  :6, marginInline : 4}}>
                                <InputText
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Enter Role"
                                />
                            </div>
                            <div className="p-col-12 p-md-4" style={{flex  :1}}>
                                <Button label="Add" icon="pi pi-plus" onClick={handleAddString} />
                            </div>
                        </div>
                        <ul>
                            {stringsArray.map((str, index) => (
                                <li key={index}>{str}</li>
                            ))}
                        </ul>
                    </div>
                    <Button label='Submit'/>
                </div>
            </div>
        </form>
    );
};

const App = () => {
    return (
        <div className="p-d-flex p-jc-center">
            <RegistrationForm />
        </div>
    );
};

export default App;
