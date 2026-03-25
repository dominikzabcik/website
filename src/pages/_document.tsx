import Document, { Head, Html, Main, NextScript } from 'next/document';

const colorSchemeScript = `(function(){try{var l=window.matchMedia('(prefers-color-scheme: light)').matches;document.documentElement.classList.toggle('dark',!l);}catch(e){document.documentElement.classList.add('dark');}})();`;

export default class WebsiteDocument extends Document {
    override render() {
        return (
            <Html lang="en" className="dark" suppressHydrationWarning>
                <Head>
                    <script
                        dangerouslySetInnerHTML={{ __html: colorSchemeScript }}
                    />
                </Head>
                <body className="min-h-screen antialiased">
                    <Main />
                    <NextScript />
                    <script
                        async
                        defer
                        src="https://lab.alistair.cloud/latest.js"
                    />
                </body>
            </Html>
        );
    }
}
