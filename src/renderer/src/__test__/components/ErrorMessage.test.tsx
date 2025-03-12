import '@testing-library/jest-dom'; // jest-dom の matcherを使用
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { errorData } from '../../../../shared/constants';
import ErrorMessage from '../../components/ErrorMessage';

describe('ErrorMessage', () => {
  it('エラーがない場合、何も表示されない', () => {
    render(<ErrorMessage diffPixelList={[]} diffImageList={[]} />);
    expect(screen.queryByText(/差分画像を作成することができませんでした。/)).toBeNull();
    expect(screen.queryByText(/Basic認証に失敗しました。/)).toBeNull();
  });

  it('差分画像エラーがある場合、エラーメッセージが表示される', () => {
    render(<ErrorMessage diffPixelList={[]} diffImageList={[errorData.diffImage]} />);
    expect(
      screen.getByText('差分画像を作成することができませんでした。もう一度実行してください。')
    ).toBeInTheDocument();
  });

  it('画像サイズエラーがある場合、エラーメッセージが表示される', () => {
    render(<ErrorMessage diffPixelList={[errorData.imageSize]} diffImageList={[]} />);
    expect(
      screen.getByText(
        '差分の確認を行うことができませんでした。大量の差分が発生している可能性があるためページをご確認ください。'
      )
    ).toBeInTheDocument();
  });

  it('Basic認証エラーがある場合、エラーメッセージが表示される', () => {
    render(<ErrorMessage diffPixelList={[errorData.basicAuthentication]} diffImageList={[]} />);
    expect(
      screen.getByText('Basic認証に失敗しました。正しいユーザー名とパスワードを入力してください。')
    ).toBeInTheDocument();
  });

  it('ページアクセスエラーがある場合、エラーメッセージが表示される', () => {
    render(<ErrorMessage diffPixelList={[errorData.pageAccess]} diffImageList={[]} />);
    expect(
      screen.getByText('ページにアクセスできませんでした。URLに誤りがないかご確認ください。')
    ).toBeInTheDocument();
  });

  it('複数のエラーがある場合、すべてのエラーメッセージが表示される', () => {
    render(
      <ErrorMessage
        diffPixelList={[errorData.basicAuthentication, errorData.pageAccess]}
        diffImageList={[errorData.diffImage]}
      />
    );
    expect(
      screen.getByText('差分画像を作成することができませんでした。もう一度実行してください。')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Basic認証に失敗しました。正しいユーザー名とパスワードを入力してください。')
    ).toBeInTheDocument();
    expect(
      screen.getByText('ページにアクセスできませんでした。URLに誤りがないかご確認ください。')
    ).toBeInTheDocument();
  });
});
