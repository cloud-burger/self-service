resource "aws_s3_bucket" "terraform-state" {
  bucket = "terraform-state"
  tags = {
    Name = "terraform-state"
  }
}