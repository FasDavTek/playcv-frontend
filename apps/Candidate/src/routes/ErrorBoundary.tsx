import { useRouteError } from 'react-router-dom';

// import { useAppState } from "../contexts/app/AppProvider";

export default function ErrorBoundary(): React.ReactElement {
  const error: any = useRouteError();

  return <h1>{}</h1>;
}
