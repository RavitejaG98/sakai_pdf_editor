import React, { useRef, useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import Link from 'next/link';
import PDFComponent from '../../demo/components/PDFComponentNew';

import dynamic from 'next/dynamic';

// const PDFComponent = dynamic(() => import('../../demo/components/PDFComponent'), { ssr: false });


const multiselectValues = [
    { name: 'Employee 001', code: 'AU' },
    { name: 'Employee 002', code: 'BR' },
    { name: 'Employee 003', code: 'CN' },
    { name: 'Employee 004', code: 'EG' },
    { name: 'Employee 005', code: 'FR' },
    { name: 'Employee 006', code: 'DE' },

];


const itemTemplate = (option) => {
    return (
        <div className="flex align-items-center ">
            {/* <span className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px', height: '12px' }} /> */}
            <span>{option.name}</span>
        </div>
    );
};

const FileDemo = () => {
    const toast = useRef(null);
    // const [multiselectValue, setMultiselectValue] = useState(null);
    const [b, setB] = useState(true)
    const [pdf, setPDF] = useState(true)
    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'dwg File Uploaded', life: 3000 });
    };
    const onUpload1 = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'PDF File Uploaded', life: 3000 });
        setB(false)
    };
    return (
        <div className="grid">
            <Toast ref={toast}></Toast>
            {!pdf && <div className="col-12">
                <div className="card">
                    {/* <h5>Advanced</h5>
                    <FileUpload name="demo[]" url="/api/upload" onUpload={onUpload} multiple 
                     maxFileSize={1000000} /> */}

                    <h5>Upload .dwg File</h5>
                    <FileUpload name="demo[]" url="/api/upload" onUpload={onUpload} multiple
                        maxFileSize={1000000} />
                    <h5>Upload Drawing PDF</h5>
                    <FileUpload name="demo[]" url="/api/upload" onUpload={onUpload1} multiple
                        maxFileSize={1000000} />

                    <br />
                    {/* <MultiSelect value={multiselectValue} onChange={(e) => setMultiselectValue(e.value)} options={multiselectValues} optionLabel="name" placeholder="Select Employees" filter display="comma" itemTemplate={itemTemplate}
                         className=''
                         
                         /> */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button disabled={b} onClick={() => setPDF(true)} >
                            <a target="_blank" style={{ color: 'white' }} >
                                Add Signature Table
                            </a>
                            {/* <Link href="http://10.244.3.132:5173" style={{ color: "white" }} scroll={false}>
                                Add Signature Table
                            </Link> */}

                        </Button>
                    </div>

                </div>

            </div>}
            {/* <PDFComponent/> */}
            {pdf && <div>
                <PDFComponent />
            </div>}
        </div>
    );
};

export default FileDemo;
