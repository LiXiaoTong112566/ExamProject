import React, { useState, } from "react";
import { connect } from "dva";
import readExamScss from "./readExam.scss";
import { Slider, Button, Modal ,Table} from "antd";

import XLSX from 'xlsx';
function testClass(props) {
  // console.log(props);
  //let score = props.location.params.score;
  const [newscore, setNewScore] = useState(0);
  const [visible, setVisible] = useState(false);
  const onChange = value => {
    // console.log(value);
    setNewScore(value);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = e => {
    setVisible(false);
  };

  const handleCancel = e => {
    setVisible(false);
  };


  // 申明表格数据
  let [data, setData] = useState([]);
  let [columns, setColumns] = useState([]);

  // 处理表格上传
  let uploadExcel = e=>{
    var reader = new FileReader();
    reader.onload = function(e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, {type: 'array'});

      /* DO SOMETHING WITH workbook HERE */
      // 读取第2张表
      var sheetName = workbook.SheetNames[1];
      var obj = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // 处理表格数据
      setData(obj);

      // 处理表头
      let columns = Object.keys(obj[0]).map(item=>{
        return {
          title: item,
          dataIndex: item
        }
      })
      setColumns(columns);
    };
    reader.readAsArrayBuffer(e.target.files);
  }

  // 处理excel导出
  let exportExcel = ()=>{
    // 1. 生成workSheet
    var ws = XLSX.utils.json_to_sheet(data);
    // 2. 生成workBook
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws);
    // 3. 导出workBook
    XLSX.writeFile(wb, 'out.xlsb');
  }
  return (
    <div className={readExamScss.box}>
        <input type="file" accept="*" placeholder="上传Excel" onChange={uploadExcel}/>

        <button onClick={()=>exportExcel()}>导出excel</button>
        <Table dataSource={data} columns={columns} rowKey="班级"/>;
      <h1>阅卷</h1>

      <div className={readExamScss.main}>
        <h1>分数是{newscore}</h1>
        <div>
          <Slider
            min={1}
            max={100}
            tooltipVisible={false}
            value={typeof newscore === "number" ? newscore : 0}
            onChange={onChange}
            style={{ width: "300px" }}
          />
        </div>

        <div>
          <Button type="primary" onClick={showModal}>
           确定
          </Button>
          <Modal
           
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="确认"
          cancelText="取消"
          >
              <h3>确定提交阅卷结果?</h3>
              <div>分数值是{newscore}</div>
           
          </Modal>
        </div>
      </div>
    </div>
  );
}
testClass.propTypes = {};

export default connect()(testClass);
