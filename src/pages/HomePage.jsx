import ArticleGeneral from '../components/ArticleGeneral';
import ArticleLatest from '../components/ArticleLatest';
import ArticlePopular from '../components/ArticlePopular';

function HomePage() {
  return (
    <>
      <ArticleLatest />
      <ArticlePopular />
      <ArticleGeneral />
    </>
  );
}

export default HomePage;
