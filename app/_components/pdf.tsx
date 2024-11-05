'use client';

import { Button, Spin, Tooltip, Upload } from 'antd';
import styled from './pdf.module.css'
import { ReactNode, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { degrees, PDFDocument } from 'pdf-lib';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { RcFile, UploadChangeParam } from 'antd/es/upload';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function Pdf() {
  const [file, setFile] = useState<RcFile>()
  const [numPages, setNumPages] = useState<number>();
  const [pagesConfig, setPagesConfig] = useState<{rotate: number}[]>([]);
  const [containerWidth, setContainerWidth] = useState(120);
  const [loading, setLoading] = useState(false);


  const handleChange = async (e: UploadChangeParam) => {
    setLoading(true);
    console.log(e.file.originFileObj);
    setFile(e.file.originFileObj);


  };
  // 旋转所有页面
  const handleRotate = () => {
    console.log(numPages);
    const newConfig = pagesConfig.map<{rotate: number}>(item => {
      return {...item, rotate: item.rotate + 90};
    })
    setPagesConfig(newConfig as {rotate: number}[]);
  }
  // 删除当前pdf
  const handleRemove = () => {
    setFile(undefined);
  }
  // 放大
  const handleScaleUp = () => {
    setContainerWidth(containerWidth + 50);

  }
  // 缩小
  const handleScaleDown = () => {
    setContainerWidth(Math.max(containerWidth - 50, 120));
  }
  // 下载
  const handleDownload = async () => {
    const doc = await PDFDocument.load(await file!.arrayBuffer())
    const pages = doc.getPages()
    pages.forEach((page, index) => {
      page.setRotation(degrees(pagesConfig[index].rotate));
    })
    const bytes = await doc.save()
    const pdfFile = new Blob([bytes], { type: 'application/pdf' })

    const url = document.createElement('a');
    url.href= URL.createObjectURL(pdfFile);
    url.download = 'aa.pdf';
    url.click();
    
  }

  const handlePageClick = (index: number) => {
    pagesConfig[index].rotate = pagesConfig[index].rotate + 90;
    setPagesConfig([...pagesConfig]);
  }
  
  function onDocumentLoadSuccess({ numPages: nextNumPages }: { numPages: number }): void {
    setNumPages(nextNumPages);
    
    setPagesConfig([...Array.from(new Array(nextNumPages), () => ({rotate: 0}))])
    setTimeout(() => {
      setLoading(false)
    }, 1000)
    
  }
  return (
    <>
    { loading && <div className={styled.loading}><Spin size="small" /></div>}
    {
      !file && !loading &&
      <div className={styled.upload}>
      <Upload
        name="avatar"
        showUploadList={false}
        onChange={handleChange}
      >
        <div className={styled.upload_content}>
        <svg width={32} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"></path></svg>
        <p>Click to upload or drag and drop</p>
        </div>
      </Upload>   
      </div>
    }
    { file &&
      <div className={styled.tools}>
        <Tooltip>
          <Button  onClick={handleRotate} className={styled.rotate}>Rotate all</Button>
        </Tooltip>
        <Tooltip title="Remove this PDF and select a new one">
          <Button onClick={handleRemove} className={styled.remove}>Remove PDF</Button>
        </Tooltip>
        <Tooltip title="Zoom in">
          <Button onClick={handleScaleUp} shape="circle" className={styled.circle}>
          <svg width={20} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"></path></svg>
          </Button>
        </Tooltip>
        <Tooltip title="Zoom out">
          <Button onClick={handleScaleDown} shape="circle" className={styled.circle}>
          <svg width={20} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"></path></svg>
          </Button>
        </Tooltip>
      </div>
    }
     {
      pagesConfig && <Document file={file} onLoadSuccess={onDocumentLoadSuccess} >
      <div className={styled.book}>
     {pagesConfig.map((_el, index) => (
              <SinglePage onClick={() => handlePageClick(index)} index={index + 1} key={index}>
                <div  style={{
                transform: `rotate(${_el.rotate}deg)`,
                transition: 'transform 0.3s',
              }}>
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width={containerWidth}
                    // height={240}
                  />
                </div>
               
              </SinglePage>
             ))}
             </div>
     </Document>
     }
     {file && <Tooltip title="split and download pdf"><Button onClick={handleDownload} className={styled.download}>Download</Button></Tooltip>}
     
     </>
  );
}

function SinglePage(props: {
  onClick?: () => void;
  children?: ReactNode | ReactNode[];
  index?: number;
}) {
  return (
    <div className={styled.single}
    onClick={props.onClick}
    >
      <div className={styled.leftTop}>
      <svg width={10} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z"></path></svg>
      </div>
      {props.children}
      <div className={styled.current}>{props.index}</div>
    </div>
  );
}