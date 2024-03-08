'use client';
import React, { useEffect } from 'react';
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Font,
} from '@react-pdf/renderer';
import { parse } from 'csv-parse/sync';

Font.register({
    family: 'Noto Serif',
    src: '/Noto_Serif_Thai/NotoSerifThai-VariableFont_wdth,wght.ttf',
});

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
        padding: '40 20 50 20',
        fontFamily: 'Noto Serif',
        fontSize: 12,
    },
});

export default function UATDocument() {
    const getUATFile = async () => {
        const res = await fetch('/uat/uat-2024-mar-09-00-12.csv');
        const data = await res.text();

        const records = parse(data, { delimiter: ',' });

        console.log(records);
    };

    useEffect(() => {
        getUATFile();
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text>Hello World!</Text>
            </Page>
        </Document>
    );
}
