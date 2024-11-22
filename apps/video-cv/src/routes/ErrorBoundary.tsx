import { useRouteError } from 'react-router-dom';

export default function ErrorBoundary(): React.ReactElement {
  const error: any = useRouteError();

  return <h1>{error.data}</h1>;
}
