import { SelectedGroup } from '@/components/hooks/useCreateInviteCode';

import Chip from './chip/chip';
import './chip/chip.css';

type Props = {
    selectedGroup: SelectedGroup;
    deleteChip: (title: string) => void;
};

export default function GroupSelectedDisplay({
    selectedGroup,
    deleteChip,
}: Props) {
    return (
        <div>
            {Object.values(selectedGroup).length != 0 && (
                <ul className="flex flex-wrap gap-2">
                    {Object.keys(selectedGroup).map((key) => (
                        <Chip
                            key={key}
                            title={selectedGroup[key]}
                            slug={key}
                            deleteChip={deleteChip}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}
