
import React, {useEffect, useState} from 'react';

import dynamic from 'next/dynamic';

import "../../../node_modules/react-quill/dist/quill.core.css";
//import "../../../node_modules/react-quill/dist/quill.snow.css";

//import ReactQuill from 'react-quill';
//import 'react-quill/dist/quill.snow.css';

import styles  from './editor.module.css';
import './editor.less';


const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
  })


export default function Editor({value, onChange}) {
    const modules = {
      toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        [{ color: ["red", "#785412"] }],
        [{ background: ["red", "#785412"] }]
      ]
    };
  
    const formats = [
      "header",
      "bold",
      "italic",
      "underline",
      "list",
      "bullet",
      "link",
      "color",
      "background",
    ];
  
    const [code, setCode] = useState("hellllo");
    const handleProcedureContentChange = (content, delta, source, editor) => {
      //setCode(content);
      onChange(content);
      //let has_attribues = delta.ops[1].attributes || "";
      //console.log(has_attribues);
      //const cursorPosition = e.quill.getSelection().index;
      // this.quill.insertText(cursorPosition, "★");
      //this.quill.setSelection(cursorPosition + 1);
    };
  
    return (
      <>
        <div className={styles.quillCont}>
        <QuillNoSSRWrapper
          style={{borderRadius: "10px"}}
          theme="snow"
          modules={modules}
          formats={formats}
          value={value}
          onChange={handleProcedureContentChange}
        />
        </div>
      </>
    );
  } 