import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Table from '../../components/Table';

describe('Table', () => {
  it('リストが全て空の場合、テーブルがレンダリングされない', () => {
    render(<Table sourceUrlList={[]} targetUrlList={[]} diffPixelList={[]} diffImageList={[]} />);

    const table = screen.queryByRole('table');
    expect(table).toBeNull();
  });

  it('diffPixelListとdiffImageListが空の場合、テーブルにはURLの列のみ表示される', () => {
    const mockSourceUrlList = ['https://source1.com', 'https://source2.com'];
    const mockTargetUrlList = ['https://target1.com', 'https://target2.com'];

    render(
      <Table
        sourceUrlList={mockSourceUrlList}
        targetUrlList={mockTargetUrlList}
        diffPixelList={[]}
        diffImageList={[]}
      />
    );

    expect(screen.getByText('Source URL')).toBeInTheDocument();
    expect(screen.queryByText('差分量（px）')).toBeNull();
    expect(screen.queryByText('差分画像')).toBeNull();
  });

  it('リストが全て空ではない場合、テーブルに全ての列が表示される', () => {
    const mockSourceUrlList = ['https://source1.com'];
    const mockTargetUrlList = ['https://target1.com'];
    const mockDiffPixelList = [10];
    const mockDiffImageList = ['image1'];

    render(
      <Table
        sourceUrlList={mockSourceUrlList}
        targetUrlList={mockTargetUrlList}
        diffPixelList={mockDiffPixelList}
        diffImageList={mockDiffImageList}
      />
    );

    expect(screen.getByText('https://source1.com')).toBeInTheDocument();
    expect(screen.getByText('https://target1.com')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('保存')).toBeInTheDocument();
  });
});
