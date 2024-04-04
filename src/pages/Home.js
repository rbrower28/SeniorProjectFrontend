import './Home.css';
import Graph from '../components/Graph';
import Entry from '../components/Entry'

export default function Home() {

  return (
    <div>
      <h1>My Cash Flow</h1>
      <Graph />
      <h2>Data Entry</h2>
      <Entry />
    </div>
    );
}