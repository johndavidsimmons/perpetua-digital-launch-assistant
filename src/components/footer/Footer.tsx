'use client';

import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="mt-auto w-full bg-blue-500 py-4">
            <div className="container mx-auto text-center text-white">
                <p>
                    <Link className="underline" target='_blank' href="/privacy">Privacy Policy</Link> |{" "}
                    <Link className="underline" target='_blank' href="/features">Features</Link> |{" "}
                    <Link className="underline" target='_blank' href="https://www.perpetua.digital">Blog</Link>
                </p>
            </div>
        </footer >
    );
};

export default Footer;