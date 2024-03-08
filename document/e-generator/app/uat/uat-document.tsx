'use client';

import React from 'react';
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Font,
} from '@react-pdf/renderer';

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
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text>Hello World!</Text>
            </Page>
        </Document>
    );
}
