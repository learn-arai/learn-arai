'use client';

import { PDFViewer } from '@react-pdf/renderer';
import UATDocument from './uat-document';

export default function Page() {
    return (
        <>
            <PDFViewer className="h-screen w-full">
                <UATDocument />
            </PDFViewer>
        </>
    );
}
