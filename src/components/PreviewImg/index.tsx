import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
interface Props {
  styleType?: any;
  alt: string;
  src: string;
}
const PreviewImg = (Props: Props) => {
  console.log('TCL: PreviewImg -> Props', Props.styleType);
  const [Visible, setVisible] = useState<boolean>(false);
  useEffect(() => {
    setVisible(Visible);
  });

  return (
    <span>
      <img
        {...Props}
        alt={Props.alt}
        onClick={() => setVisible(true)}
        style={{
          height: Props.styleType ? Props.styleType[0] : '50px',
          width: Props.styleType ? Props.styleType[0] : '50px'
        }}
      />
      {Props.src && (
        <Modal
          visible={Visible}
          footer={null}
          maskClosable={true}
          onCancel={() => setVisible(false)}
        >
          <img
            alt=""
            style={{ width: '100%' }}
            src={Props.src.toString()}
            onClick={() => setVisible(false)}
          />
        </Modal>
      )}
    </span>
  );
};
export default PreviewImg;
