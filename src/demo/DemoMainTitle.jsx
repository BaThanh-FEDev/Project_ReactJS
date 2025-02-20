import MainTitle from '../components/shared/MainTitle';

function DemoMainTitle() {
  return (
    <div className="tcl-container">
      <MainTitle>Tiêu đề 01</MainTitle>
      <MainTitle>Tiêu đề 02</MainTitle>
      <MainTitle btnLabel="Xem Them">Tiêu đề 02</MainTitle>
      <MainTitle btnLabel="Xem Them" btnProps={{ type: 'category' }}>
        Tiêu đề 02
      </MainTitle>
      <MainTitle btnLabel="Xem Them" btnProps={{ type: 'primary' }}>
        Tiêu đề 02
      </MainTitle>
      <MainTitle
        btnLabel="Xem Them"
        btnProps={{
          type: 'primary',
          size: 'large',
          onClick: () => {
            console.log('Click vao button trong MainTitle');
          },
        }}
      >
        Tiêu đề 02
      </MainTitle>

      <MainTitle
        btnLabel="Xem Them"
        btnProps={{
          type: 'primary',
          size: 'large',
          as: 'a',
          title: 'Tieu de cua the a',
          target: '_blank',
          href: 'http://zendvn.com',
        }}
      >
        Tiêu đề 02 voi link
      </MainTitle>
    </div>
  );
}

export default DemoMainTitle;
