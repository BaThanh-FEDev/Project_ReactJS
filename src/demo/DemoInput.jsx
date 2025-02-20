import Input from '../components/shared/Input';
import IconLoading from '../components/shared/IconLoading';

function DemoInput() {
  return (
    <div className="tcl-container">
      <div className="tcl-col-4">
        <Input label="Username" placeholder="Enter Username ..." />
        <Input
          type="password"
          label="Password"
          placeholder="Enter Password ..."
          onChange={(evt) => {
            console.log('evt', evt.target.value);
          }}
          className="world"
        />
        <Input />
        <Input type="search" placeholder="Nhap gia tri search ..." className="hello" />
        <Input
          type="search"
          placeholder="Nhap gia tri search ..."
          className="hello"
          icon={<IconLoading width="1em" />}
        />

        <Input type="search" placeholder="Nhap gia tri search ..." className="hello" icon="FAX:" />
      </div>
    </div>
  );
}

export default DemoInput;
