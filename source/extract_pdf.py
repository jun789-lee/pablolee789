import fitz
import os

source_dir = r'c:\Users\789\Desktop\githublog\pablolee789\source'
output_file = os.path.join(source_dir, 'course_overview.txt')

pdfs = [
    '第1回イントロダクション.pdf',
    '第2回相関係数.pdf',
    '第3回相関係数続きと二変量正規分布.pdf',
    '第4回離散同時（結合）確率関数.pdf',
    '第5回離散確率変数の共分散・重積分その1.pdf',
    '第６回重積分その2.pdf',
    '第7回変数変換公式.pdf',
    '第8回ボックス＝ミューラー方式と多変量正規分布.pdf',
    '第9回多変量正規分布のモーメント母関数.pdf',
    '第10回結合モーメント.pdf',
    '第11回多変量中心極限定理.pdf',
    '第12回単回帰分析の大標本理論.pdf',
    '第13回期末テスト対策.pdf'
]

with open(output_file, 'w', encoding='utf-8') as out:
    for pdf_name in pdfs:
        path = os.path.join(source_dir, pdf_name)
        if os.path.exists(path):
            doc = fitz.open(path)
            out.write(f'\n{"="*60}\n')
            out.write(f'=== {pdf_name} ===\n')
            out.write(f'{"="*60}\n\n')
            text = ''
            for page in doc:
                text += page.get_text()
            out.write(text[:3000])  # First 3000 chars per lecture
            out.write('\n\n[...truncated...]\n')
            doc.close()
        else:
            out.write(f'\n[NOT FOUND] {pdf_name}\n')

print(f'Saved to {output_file}')
