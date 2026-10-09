import { TreeSelect } from 'antd';
import { useBranches } from '../../hooks/useReference';

const branchKey = (id) => `b${id}`;
const subbranchKey = (id) => `s${id}`;

/**
 * Tree picker of branches of law and their sub-branches.
 *
 * `value` and `onChange` use { branch_id, subbranch_id }; choosing a
 * sub-branch also reports the branch it belongs to.
 */
export default function BranchSelect({ id, value, onChange, errorStatus, size }) {
  const branches = useBranches();

  const treeData = branches.map((branch) => ({
    value: branchKey(branch.id),
    title: branch.name.toUpperCase(),
    children: branch.subbranches.map((sub) => ({ value: subbranchKey(sub.id), title: sub.name })),
  }));

  const selected = value?.subbranch_id
    ? subbranchKey(value.subbranch_id)
    : value?.branch_id
      ? branchKey(value.branch_id)
      : undefined;

  const onThisChange = (key) => {
    if (!key) {
      onChange?.({ branch_id: null, subbranch_id: null });
      return;
    }
    const id = Number(key.slice(1));
    if (key.startsWith('b')) {
      onChange?.({ branch_id: id, subbranch_id: null });
      return;
    }
    const parent = branches.find((branch) => branch.subbranches.some((sub) => sub.id === id));
    onChange?.({ branch_id: parent?.id ?? null, subbranch_id: id });
  };

  return (
    <TreeSelect
      // From Form.Item: ties the field to its label.
      id={id}
      showSearch
      allowClear
      treeDefaultExpandAll
      treeNodeFilterProp="title"
      style={{ width: '100%' }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="Начните ввод для поиска"
      treeData={treeData}
      value={selected}
      onChange={onThisChange}
      status={errorStatus ? 'error' : undefined}
      size={size}
    />
  );
}
