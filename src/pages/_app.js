import '../styles/globals.css';
import '../styles/App.css';


function MyApp({ Component, pageProps }) {
    return (
        <div className='app-background'>
            <Component {...pageProps} />
        </div >
    );
}

export default MyApp;