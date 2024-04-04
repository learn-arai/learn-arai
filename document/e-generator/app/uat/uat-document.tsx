'use client';
import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, Font } from '@react-pdf/renderer';
import { parse } from 'csv-parse/sync';
import { styles } from './styles';

Font.register({
    family: 'Noto Serif',
    fonts: [
        {
            src: '/Noto_Serif_Thai/static/NotoSerifThai-Regular.ttf',
            fontWeight: 'normal',
        },
        {
            src: '/Noto_Serif_Thai/static/NotoSerifThai-Bold.ttf',
            fontWeight: 'bold',
        },
    ],
});

interface UATHeader {
    code: string; // รหัสทดสอบ
    testDate: string; // วันที่ทดสอบ
    system: string; // ระบบส่วนงาน
    workName: string; // ชื่อการทำงาน
    screenCode: string; // รหัสหน้าจอ - ชื่อหน้าจอ
    description: string; // คำอธิบาย
    condition: string; // เงื่อนไขก่อนการทำงาน
    process: string; // ขั้นตอนการทำงาน
    expected: string; // ผลที่คาดว่าจะได้รับ
    result: string; // ผลการทดสอบ
    note: string; // บันทึกเพิ่มเติม
}

export default function UATDocument() {
    const [uatData, setUATData] = useState<UATHeader[] | null>(null);

    const getUATFile = async () => {
        if (uatData !== null) return;

        const res = await fetch('/uat/uat-2024-apr-04-18-26.csv');
        const data = await res.text();

        const records: any[][] = parse(data, { delimiter: ',' });
        console.log(records);
        records.shift();

        const parsedRecords: UATHeader[] = [];
        for (let i = 0; i < records.length; i++) {
            parsedRecords.push({
                code: records[i][0],
                testDate: records[i][1],
                system: records[i][2],
                workName: records[i][3],
                screenCode: records[i][4],
                description: records[i][5],
                condition: records[i][6],
                process: records[i][7],
                expected: records[i][8],
                result: records[i][9],
                note: records[i][10],
            });
        }

        console.log(parsedRecords);

        setUATData(parsedRecords);
    };

    useEffect(() => {
        getUATFile();
    });

    return (
        <Document>
            {uatData?.map((data, idx) => (
                <Page size="A4" style={styles.page} key={data.code}>
                    <View style={styles.tableRow}>
                        <Text style={styles['tableItem-1/4-bold']}>
                            รหัสทดสอบ{' '}
                        </Text>
                        <Text style={styles['tableItem-1/4']}>
                            {data.code}{' '}
                        </Text>
                        <Text style={styles['tableItem-1/4-bold']}>
                            วันที่ทดสอบ{' '}
                        </Text>
                        <Text style={styles['tableItem-1/4']}>{data.testDate}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles['tableItem-1/4-bold']}>
                            ระบบ/ส่วนงาน{' '}
                        </Text>
                        <Text style={styles['tableItem-3/4']}>
                            {data.system}{' '}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles['tableItem-1/4-bold']}>
                            ชื่อการทำงาน{' '}
                        </Text>
                        <Text style={styles['tableItem-3/4']}>
                            {data.workName}{' '}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles['tableItem-1/4-bold']}>
                            รหัสหน้าจอ-ชื่อหน้าจอ{' '}
                        </Text>
                        <Text style={styles['tableItem-3/4']}>
                            {data.screenCode}{' '}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles['tableItem-1/4-bold']}>
                            คำอธิบาย{' '}
                        </Text>
                        <Text style={styles['tableItem-3/4']}>
                            {data.description}{' '}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles['tableItem-1/4-bold']}>
                            เงื่อนไขก่อนการทำงาน{' '}
                        </Text>
                        <Text style={styles['tableItem-3/4']}>
                            {data.condition}{' '}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles['tableItem-1/4-bold']}>
                            ขั้นตอนการทำงาน{' '}
                        </Text>
                        <Text style={styles['tableItem-3/4']}>
                            {data.process.split('\n').map((txt, idx) => {
                                const indent = txt.startsWith('_');
                                if (indent) {
                                    txt = txt.substring(1);
                                }

                                return (
                                    <Text
                                        key={idx}
                                        style={{
                                            ...(indent && {
                                                textIndent: '20px',
                                            }),
                                        }}
                                    >
                                        {txt}
                                        {'\n'}
                                    </Text>
                                );
                            })}
                        </Text>
                    </View>
                </Page>
            ))}
        </Document>
    );
}
