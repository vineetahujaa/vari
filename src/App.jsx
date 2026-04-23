import {WaitlistProvider} from './context/WaitlistContext';
import Header from './components/Header';
import Hero from './components/Hero';

export default function App(){
return(
<WaitlistProvider>
<Header/>
<Hero/>
</WaitlistProvider>
)
}