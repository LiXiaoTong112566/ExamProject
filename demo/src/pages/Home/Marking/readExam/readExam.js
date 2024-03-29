/**
 * 阅卷管理 
 * 表格的导入导出
 */

import React, { useState,useEffect } from "react";
import { connect } from "dva";
import readExamScss from "./readExam.scss";
import XLSX from "xlsx";
import { Slider,  Button, Modal, Table } from "antd";

function testClass(props) {
  let id = props.match.params.id;

  const [newscore, setNewScore] = useState(0);
  const [visible, setVisible] = useState(false);

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const onChange = value => {
    setNewScore(value);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = e => {
    setVisible(false);
    props.getScore({ score: newscore });
  };

  const handleCancel = e => {
    setVisible(false);
  };

  useEffect(() => {
    props.getStudentExam(id);
  }, []);
//文件读取  导入
  let uploadExcel = e => {
    //FileReader 用来把文件读入内存，并且读取文件中的数据
    var reader = new FileReader();
    reader.onload = function(e) {
      // console.log(e)
      //Uint8Array 数组类型表示一个8位无符号整型数组，创建时内容被初始化为0。创建完后，可以以对象的方式或使用数组下标索引的方式引用数组中的元素。
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: "array" });
      //console.log(workbook)
      //读取表
      var sheetName = workbook.SheetNames[0];//名称
      //获取的所有数据
      var obj = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      //处理表格数据
      setData(obj);
      //处理表头
      let columns = Object.keys(obj[0]).map(item => {
        return {
          title: item,
          dataIndex: item
        };
      });

      setColumns(columns);
    };
    reader.readAsArrayBuffer(e.target.files[0]);
  };
//  导出 先得有一个文件xlsx
  let exportExcel = () => {
    // 1. 生成workSheet
    var ws = XLSX.utils.json_to_sheet(data);
    // 2. 生成workBook
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws);
    // 3. 导出workBook
    XLSX.writeFile(wb, "out.xlsb");
  };

  return (
    <div className={readExamScss.box}>
        <input type="file" accept="*" placeholder="上传Excel" onChange={uploadExcel}/>
        <button onClick={()=>exportExcel()}>导出excel</button>
        <Table dataSource={data} columns={columns} rowKey="班级"></Table>
      <h1>阅卷</h1>
      <div className={readExamScss.examBox}>
        <div className={readExamScss.leftBox}>
          <h1>试卷详情</h1>
        </div>

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

      {/* <div>
        <input
          type="file"
          accept="*"
          placeholder="上传Excel"
          onChange={uploadExcel}
        />

        <button onClick={() => exportExcel()}>导出excel</button>

        <Table dataSource={data} columns={columns} rowKey="班级" />
      </div> */}
    </div>
  );
}
testClass.propTypes = {};

const mapStateToProps = state => {
  return {
    ...state.AwaitClassModel
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getStudentExam(data) {
      dispatch({
        type: "AwaitClassModel/getAwaitClassModel",
        payload: { exam_student_id: data }
      });
    },
    getScore(data) {
      dispatch({
        type: "AwaitClassModel/getScoreModel",
        payload: data
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(testClass);
