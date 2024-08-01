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
                    <h5>User Registration</h5>
                    <div className="grid formgrid m-2">
                        {/* <div className="col-12 mb-2 lg:col-4 lg:mb-0 m-5">
                            <span className="p-float-label">
                                <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                <label htmlFor="username">Username</label>
                            </span>
                        </div> */}
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0 m-5">
                            <span className="p-float-label">
                                <InputText id="firsname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                                <label htmlFor="First Name">Firstname</label>
                            </span>
                        </div>
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0 m-5">
                            <span className="p-float-label">
                                <InputText id="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                                <label htmlFor="Last Name">lastname</label>
                            </span>
                        </div>
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0 m-5">
                            <span className="p-float-label">
                                <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <label htmlFor="email">Email</label>
                            </span>
                        </div>
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0 m-5">
                            <span className="p-float-label">
                                <InputText id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                <label htmlFor="phone">phone</label>
                            </span>
                        </div>
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0 m-5">
                            <span className="p-float-label">
                                <Calendar id="dob" value={dob} onChange={(e) => setDob(e.value)} showIcon />
                                <label htmlFor="dob">Date of Birth</label>
                            </span>
                        </div>
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0 m-5">
                            <span className="p-float-label">
                                <Dropdown id="Zone" value={Zone} options={Zones} onChange={(e) => setZone(e.value)} placeholder="Select a Zone" />
                                <label htmlFor="Zone">Zone</label>
                            </span>
                        </div>
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0 m-5">
                            <span className="p-float-label">
                                <Dropdown id="division" value={division} options={divisions} onChange={(e) => setDivision(e.value)} placeholder="Select a Division" />
                                <label htmlFor="division">Division</label>
                            </span>
                        </div>

                        {/* <div className="col-12 mb-2 lg:col-4 lg:mb-0 m-5">
                            <span className="p-float-label">
                                <MultiSelect id="stages" value={stages} options={stagesOptions} onChange={(e) => setStages(e.value)} placeholder="Select Stages" />
                                <label htmlFor="stages">Stages</label>
                            </span>
                        </div> */}
                        {/* <div className="col-12 mb-2 lg:col-4 lg:mb-0 m-5">
                            <span className="p-float-label">
                                <MultiSelect id="roles" value={roles} options={roleOptions} onChange={(e) => setRoles(e.value)} placeholder="Select Stages" />
                                <label htmlFor="roles">Roles</label>
                            </span>
                        </div> */}
                    </div>
                    <div className="p-d-flex p-jc-end">
                        <Button label="Submit" icon="pi pi-check" type="submit" />
                    </div>
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
