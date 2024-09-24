static int[,] c;

input.ForeColor = Color.Red;
                input = text1;
                numbertinput = i;
                string s1, s2;
                s1 = text1;
                s2 = text2;
                if (s1 != s2)
                {
                    lstlb[i].BackColor = Color.Red;
                }
                c = null;
                c = new int[s1.Length + 1, s2.Length + 1];
                LCS(s1, s2);
                BackTrack(s1, s2, s1.Length, s2.Length);
				
				
				
  static int LCS(string s1, string s2)
        {
            for (int i = 1; i <= s1.Length; i++)
                c[i, 0] = 0;
            for (int i = 1; i <= s2.Length; i++)
                c[0, i] = 0;

            for (int i = 1; i <= s1.Length; i++)
                for (int j = 1; j <= s2.Length; j++)
                {
                    if (s1[i - 1] == s2[j - 1])
                        c[i, j] = c[i - 1, j - 1] + 1;
                    else
                    {
                        c[i, j] = max(c[i - 1, j], c[i, j - 1]);

                    }

                }

            return c[s1.Length, s2.Length];

        }
		


        private string BackTrack(string s1, string s2, int i, int j)
        {
            if (i == 0 || j == 0)
                return "";
            if (s1[i - 1] == s2[j - 1])
            {
                input.SelectionStart = i - 1; 
                input.SelectionLength = 1;
                input.SelectionColor = Color.Black;
                return BackTrack(s1, s2, i - 1, j - 1) + s1[i - 1];
            }
            else if (c[i - 1, j] > c[i, j - 1])
                return BackTrack(s1, s2, i - 1, j);

            else
                return BackTrack(s1, s2, i, j - 1);

        }
		
 static int max(int a, int b)
        {
            return (a > b) ? a : b;
        }
		
		
		
		
		
		

#click chuột phải

				if (input.Text == text1)
                {
                    input.SelectionStart = 0;
                    input.SelectionLength = input.Text.Length;
                    input.SelectionColor = Color.Red;
                    input.Text = text2;
                    string s1, s2;
                    s1 = text2;
                    s2 = text1;
                    c = null;
                    c = new int[s1.Length + 1, s2.Length + 1];
                    LCS(s1, s2);
                    BackTrack(s1, s2, s1.Length, s2.Length);
                    lblEntry2.ForeColor = Color.Orange;
                    lblEntry1.ForeColor = Color.Black;
                }
                else if (input.Text == text2)
                {
                    input.SelectionStart = 0;
                    input.SelectionLength = input.Text.Length;
                    input.SelectionColor = Color.Red;
                    input.Text = text1;
                    string s1, s2;
                    s1 = text1;
                    s2 = text2;
                    c = null;
                    c = new int[s1.Length + 1, s2.Length + 1];
                    LCS(s1, s2);
                    BackTrack(s1, s2, s1.Length, s2.Length);
                    lblEntry1.ForeColor = Color.Orange;
                    lblEntry2.ForeColor = Color.Black;
                }
                else
                {
                    input.SelectionStart = 0;
                    input.SelectionLength = input.Text.Length;
                    input.SelectionColor = Color.Red;
                    input.Text = text1;
                    string s1, s2;
                    s1 = text1;
                    s2 = text2;
                    c = null;
                    c = new int[s1.Length + 1, s2.Length + 1];
                    LCS(s1, s2);
                    BackTrack(s1, s2, s1.Length, s2.Length);
                }		