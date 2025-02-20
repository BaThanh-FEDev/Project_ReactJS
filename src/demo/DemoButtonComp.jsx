import Button from '../components/shared/Button';

function DemoButtonComp() {
  function handleClickFirst() {
    console.log('Click on the first button');
  }

  return (
    <div className="tcl-container">
      <a href="https://google.com" title="Day la title" abc="def">
        Toi la the a
      </a>
      <Button onClick={handleClickFirst} abc="def" def="xyz">
        Nội dung ở giữa 2
      </Button>
      <Button className="hello">Nội dung ở giữa 1</Button>
      <Button className="world" as="a" href="https://google.com" title="Them cho toi cai title">
        Nội dung ở giữa 1
      </Button>
      <Button onClick={() => console.log('clickd me!')}>Click Me</Button>
      <Button type="default" size="large" loading loadingPos="right">
        Nội dung ở giữa 4
      </Button>
      <Button type="category">Nội dung ở giữa 5</Button>
      <Button type="primary">Nội dung ở giữa 6</Button>
      <Button type="primary" size="large">
        Nội dung ở giữa 7
      </Button>
      <Button type="primary" htmlType="submit">
        Nội dung ở giữa 8
      </Button>
      <Button type="primary" htmlType="submit" loading={true}>
        Nội dung ở giữa 9
      </Button>
    </div>
  );
}

export default DemoButtonComp;
