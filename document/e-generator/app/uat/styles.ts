import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
        padding: '40 20 50 20',
        fontFamily: 'Noto Serif',
        fontSize: 12,
    },
    tableRow: {
        flexDirection: 'row',
    },
    'tableItem-1/4': {
        padding: '2 10 2 10',
        width: '25%',
        borderWidth: '1px 0px 0px 1px',
        borderStyle: 'solid',
        borderColor: '#000',
    },
    'tableItem-1/4-bold': {
        padding: '2 10 2 10',
        width: '25%',
        borderWidth: '1px 0px 0px 1px',
        borderStyle: 'solid',
        borderColor: '#000',
        fontWeight: 700,
    },
    'tableItem-3/4': {
        padding: '2 10 2 10',
        width: '75%',
        borderWidth: '1px 0px 0px 1px',
        borderStyle: 'solid',
        borderColor: '#000',
    },
    'tableItem-3/4-bold': {
        padding: '2 10 2 10',
        width: '75%',
        borderWidth: '1px 0px 0px 1px',
        borderStyle: 'solid',
        borderColor: '#000',
        fontWeight: 700,
    },
});
